import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  WorkOutline as WorkOutlineIcon,
} from '@mui/icons-material';
import { DealResponsesService, DealResponse } from '@/services/deal-responses.service';
import { handleApiError } from '@/utils/api-retry';

interface DealResponsesListProps {
  dealId: number;
  onResponseAccepted?: () => void;
}

export const DealResponsesList: React.FC<DealResponsesListProps> = ({
  dealId,
  onResponseAccepted,
}) => {
  const [responses, setResponses] = useState<DealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:4200';

  useEffect(() => {
    loadResponses();
  }, [dealId]);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const data = await DealResponsesService.getDealResponses(dealId);
      setResponses(data);
    } catch (err) {
      console.error('Failed to load responses:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (responseId: number) => {
    if (!window.confirm('Вы уверены, что хотите принять этот отклик? Остальные отклики будут автоматически отклонены.')) {
      return;
    }

    try {
      setActionLoading(true);
      await DealResponsesService.acceptResponse(responseId);
      await loadResponses();
      onResponseAccepted?.();
    } catch (err) {
      console.error('Failed to accept response:', err);
      alert(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedResponseId) return;

    try {
      setActionLoading(true);
      await DealResponsesService.rejectResponse(selectedResponseId, {
        rejectionReason: rejectionReason || undefined,
      });
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedResponseId(null);
      await loadResponses();
    } catch (err) {
      console.error('Failed to reject response:', err);
      alert(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (responseId: number) => {
    setSelectedResponseId(responseId);
    setRejectDialogOpen(true);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Ожидает', color: 'warning' as const },
      ACCEPTED: { label: 'Принят', color: 'success' as const },
      REJECTED: { label: 'Отклонен', color: 'error' as const },
      WITHDRAWN: { label: 'Отозван', color: 'default' as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (responses.length === 0) {
    return (
      <Alert severity="info">
        Пока нет откликов на этот заказ. Когда исполнители откликнутся, они появятся здесь.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Отклики ({responses.length})
      </Typography>

      <Stack spacing={2}>
        {responses.map((response) => (
          <Card key={response.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    src={response.executor?.avatar ? `${serverUrl}${response.executor.avatar}` : undefined}
                    sx={{ width: 56, height: 56 }}
                  >
                    {!response.executor?.avatar && <PersonIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {response.executor?.fullName || response.executor?.login || 'Исполнитель'}
                    </Typography>
                    {response.executor?.profile && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Rating value={response.executor.profile.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          {response.executor.profile.rating.toFixed(1)} ({response.executor.profile.totalReviews} отзывов)
                        </Typography>
                        <Chip
                          label={`${response.executor.profile.completedDeals} заказов`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                {getStatusChip(response.status)}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {response.message}
              </Typography>

              {response.experience && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Опыт работы:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {response.experience}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                {response.proposedPrice && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoneyIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>{response.proposedPrice.toLocaleString('ru-RU')} ₽</strong>
                    </Typography>
                  </Box>
                )}
                {response.estimatedDays && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>{response.estimatedDays} дней</strong>
                    </Typography>
                  </Box>
                )}
              </Box>

              {response.executor?.profile?.specializations && response.executor.profile.specializations.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Специализации:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {response.executor.profile.specializations.map((spec, idx) => (
                      <Chip key={idx} label={spec} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Откликнулся: {new Date(response.createdAt).toLocaleString('ru-RU')}
              </Typography>

              {response.status === 'PENDING' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleAccept(response.id)}
                    disabled={actionLoading}
                  >
                    Принять
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => openRejectDialog(response.id)}
                    disabled={actionLoading}
                  >
                    Отклонить
                  </Button>
                </Box>
              )}

              {response.status === 'REJECTED' && response.rejectionReason && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Причина отклонения: {response.rejectionReason}
                </Alert>
              )}

              {response.status === 'ACCEPTED' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Отклик принят! Теперь вы можете общаться с исполнителем через менеджера.
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => !actionLoading && setRejectDialogOpen(false)}>
        <DialogTitle>Отклонить отклик</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Вы можете указать причину отклонения (необязательно):
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Например: Выбран другой исполнитель, не подходит опыт, и т.д."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)} disabled={actionLoading}>
            Отмена
          </Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading ? 'Отклонение...' : 'Отклонить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

