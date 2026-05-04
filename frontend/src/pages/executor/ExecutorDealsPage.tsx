import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Work as WorkIcon,
  Done as DoneIcon,
  Visibility as VisibilityIcon,
  Chat as ChatIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DealResponsesService, DealResponse } from '@/services/deal-responses.service';
import { DealsService } from '@/services/deals.service';
import { handleApiError } from '@/utils/api-retry';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ExecutorDealsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [responses, setResponses] = useState<DealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const navigate = useNavigate();

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:4200';

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const data = await DealResponsesService.getMyResponses();
      setResponses(data);
    } catch (err) {
      console.error('Failed to load responses:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (responseId: number) => {
    if (!window.confirm('Вы уверены, что хотите отозвать свой отклик?')) {
      return;
    }

    try {
      await DealResponsesService.withdrawResponse(responseId);
      await loadResponses();
    } catch (err) {
      console.error('Failed to withdraw response:', err);
      alert(handleApiError(err));
    }
  };

  const handleCompleteDeal = async () => {
    if (!selectedDealId) return;

    try {
      await DealsService.completeDeal(selectedDealId);
      setCompleteDialogOpen(false);
      setSelectedDealId(null);
      await loadResponses();
      alert('Заказ успешно завершен! Теперь заказчик может оставить отзыв.');
    } catch (err) {
      console.error('Failed to complete deal:', err);
      alert(handleApiError(err));
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Ожидает', color: 'warning' as const, icon: <SendIcon fontSize="small" /> },
      ACCEPTED: { label: 'Принят', color: 'success' as const, icon: <CheckCircleIcon fontSize="small" /> },
      REJECTED: { label: 'Отклонен', color: 'error' as const, icon: <CancelIcon fontSize="small" /> },
      WITHDRAWN: { label: 'Отозван', color: 'default' as const, icon: <DeleteIcon fontSize="small" /> },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  const getDealStatusChip = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: 'Активный', color: 'info' as const },
      IN_PROGRESS: { label: 'В работе', color: 'primary' as const },
      COMPLETED: { label: 'Завершен', color: 'success' as const },
      CANCELLED: { label: 'Отменен', color: 'error' as const },
      DISPUTE: { label: 'Спор', color: 'warning' as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Фильтрация откликов по вкладкам
  const allResponses = responses;
  const pendingResponses = responses.filter(r => r.status === 'PENDING');
  const acceptedResponses = responses.filter(r => r.status === 'ACCEPTED' && r.deal?.status === 'IN_PROGRESS');
  const completedResponses = responses.filter(r => r.status === 'ACCEPTED' && r.deal?.status === 'COMPLETED');
  const rejectedResponses = responses.filter(r => r.status === 'REJECTED' || r.status === 'WITHDRAWN');

  const renderResponseCard = (response: DealResponse, showActions: boolean = true) => (
    <Card key={response.id} variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {response.deal?.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {response.deal?.category}
              </Typography>
              {response.deal && getDealStatusChip(response.deal.status)}
            </Box>
            {response.deal?.customer && (
              <Typography variant="caption" color="text.secondary">
                Заказчик: {response.deal.customer.fullName || response.deal.customer.login}
              </Typography>
            )}
          </Box>
          {getStatusChip(response.status)}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Ваше предложение:
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {response.message}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
          {response.proposedPrice && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Цена
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {response.proposedPrice.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          )}
          {response.estimatedDays && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Срок
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {response.estimatedDays} дней
              </Typography>
            </Box>
          )}
          {response.deal?.budget && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Бюджет заказчика
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {response.deal.budget.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Откликнулись: {new Date(response.createdAt).toLocaleString('ru-RU')}
          </Typography>
          {response.respondedAt && (
            <Typography variant="caption" color="text.secondary" display="block">
              Ответ: {new Date(response.respondedAt).toLocaleString('ru-RU')}
            </Typography>
          )}
        </Box>

        {response.status === 'REJECTED' && response.rejectionReason && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Причина отклонения:</strong> {response.rejectionReason}
          </Alert>
        )}

        {response.status === 'ACCEPTED' && response.deal?.status === 'IN_PROGRESS' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>В работе!</strong> Общайтесь с заказчиком через чат. После завершения работы отметьте заказ
            как выполненный.
          </Alert>
        )}

        {response.status === 'ACCEPTED' && response.deal?.status === 'COMPLETED' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Завершено!</strong> Спасибо за работу. Дождитесь отзыва от заказчика.
          </Alert>
        )}

        {showActions && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(`/deals/${response.dealId}`)}
            >
              Просмотреть заказ
            </Button>

            {response.status === 'PENDING' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleWithdraw(response.id)}
              >
                Отозвать отклик
              </Button>
            )}

            {response.status === 'ACCEPTED' && response.deal?.status === 'IN_PROGRESS' && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ChatIcon />}
                  onClick={() => navigate('/chats')}
                >
                  Открыть чат
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={() => {
                    setSelectedDealId(response.dealId);
                    setCompleteDialogOpen(true);
                  }}
                >
                  Завершить заказ
                </Button>
              </>
            )}

            {response.status === 'ACCEPTED' && response.deal?.status === 'COMPLETED' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ChatIcon />}
                onClick={() => navigate('/chats')}
              >
                Просмотреть чат
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Мои заказы
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управляйте своими откликами и активными заказами
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="scrollable">
          <Tab
            label={`Все (${allResponses.length})`}
            icon={<WorkIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Ожидают ответа (${pendingResponses.length})`}
            icon={<SendIcon />}
            iconPosition="start"
          />
          <Tab
            label={`В работе (${acceptedResponses.length})`}
            icon={<CheckCircleIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Завершенные (${completedResponses.length})`}
            icon={<DoneIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Отклоненные (${rejectedResponses.length})`}
            icon={<CancelIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Вкладка: Все */}
      <TabPanel value={tabValue} index={0}>
        {allResponses.length === 0 ? (
          <Alert severity="info">
            У вас пока нет откликов. Начните откликаться на заказы, чтобы найти работу!
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/deals')}>
              Посмотреть заказы
            </Button>
          </Alert>
        ) : (
          <Stack spacing={2}>
            {allResponses.map(response => renderResponseCard(response))}
          </Stack>
        )}
      </TabPanel>

      {/* Вкладка: Ожидают ответа */}
      <TabPanel value={tabValue} index={1}>
        {pendingResponses.length === 0 ? (
          <Alert severity="info">
            Нет откликов, ожидающих ответа от заказчиков.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {pendingResponses.map(response => renderResponseCard(response))}
          </Stack>
        )}
      </TabPanel>

      {/* Вкладка: В работе */}
      <TabPanel value={tabValue} index={2}>
        {acceptedResponses.length === 0 ? (
          <Alert severity="info">
            У вас пока нет активных заказов в работе.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {acceptedResponses.map(response => renderResponseCard(response))}
          </Stack>
        )}
      </TabPanel>

      {/* Вкладка: Завершенные */}
      <TabPanel value={tabValue} index={3}>
        {completedResponses.length === 0 ? (
          <Alert severity="info">
            У вас пока нет завершенных заказов.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {completedResponses.map(response => renderResponseCard(response))}
          </Stack>
        )}
      </TabPanel>

      {/* Вкладка: Отклоненные */}
      <TabPanel value={tabValue} index={4}>
        {rejectedResponses.length === 0 ? (
          <Alert severity="info">
            Нет отклоненных откликов.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {rejectedResponses.map(response => renderResponseCard(response, false))}
          </Stack>
        )}
      </TabPanel>

      {/* Диалог завершения заказа */}
      <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Завершить заказ</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Вы уверены, что хотите отметить этот заказ как выполненный?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            После завершения заказа:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                Заказ перейдет в статус "Завершен"
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Заказчик получит уведомление
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Заказчик сможет оставить отзыв
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Ваша статистика будет обновлена
              </Typography>
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleCompleteDeal} variant="contained" color="success" startIcon={<DoneIcon />}>
            Завершить заказ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

