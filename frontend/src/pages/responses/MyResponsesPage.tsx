import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { DealResponsesService, DealResponse } from '@/services/deal-responses.service';
import { handleApiError } from '@/utils/api-retry';
import { useNavigate } from 'react-router-dom';

export default function MyResponsesPage() {
  const [responses, setResponses] = useState<DealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Ожидает ответа', color: 'warning' as const, icon: <SendIcon fontSize="small" /> },
      ACCEPTED: { label: 'Принят', color: 'success' as const, icon: <CheckCircleIcon fontSize="small" /> },
      REJECTED: { label: 'Отклонен', color: 'error' as const, icon: <CancelIcon fontSize="small" /> },
      WITHDRAWN: { label: 'Отозван', color: 'default' as const, icon: <DeleteIcon fontSize="small" /> },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

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
          Мои отклики
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Здесь вы можете отслеживать статус своих откликов на заказы
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {responses.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <SendIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас пока нет откликов
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Начните откликаться на заказы, чтобы найти новые проекты
          </Typography>
          <Button variant="contained" onClick={() => navigate('/deals')}>
            Посмотреть заказы
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {responses.map((response) => (
            <Card key={response.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {response.deal?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {response.deal?.category}
                    </Typography>
                  </Box>
                  {getStatusChip(response.status)}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Ваше сообщение:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {response.message}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  {response.proposedPrice && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Предложенная цена
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {response.proposedPrice.toLocaleString('ru-RU')} ₽
                      </Typography>
                    </Box>
                  )}
                  {response.estimatedDays && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Срок выполнения
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {response.estimatedDays} дней
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Отправлено: {new Date(response.createdAt).toLocaleString('ru-RU')}
                  </Typography>
                  {response.respondedAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Ответ получен: {new Date(response.respondedAt).toLocaleString('ru-RU')}
                    </Typography>
                  )}
                </Box>

                {response.status === 'REJECTED' && response.rejectionReason && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <strong>Причина отклонения:</strong> {response.rejectionReason}
                  </Alert>
                )}

                {response.status === 'ACCEPTED' && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <strong>Поздравляем!</strong> Ваш отклик был принят. Заказчик свяжется с вами через
                    менеджера.
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
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
                  {response.status === 'ACCEPTED' && response.deal && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/chats`)}
                    >
                      Перейти в чат
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}

