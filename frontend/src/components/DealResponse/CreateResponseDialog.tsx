import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { DealResponsesService, CreateDealResponseDto } from '@/services/deal-responses.service';

interface CreateResponseDialogProps {
  open: boolean;
  onClose: () => void;
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
}

export const CreateResponseDialog: React.FC<CreateResponseDialogProps> = ({
  open,
  onClose,
  dealId,
  dealTitle,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Omit<CreateDealResponseDto, 'dealId'>>({
    message: '',
    proposedPrice: undefined,
    estimatedDays: undefined,
    portfolioLinks: [],
    experience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await DealResponsesService.createResponse({
        dealId,
        ...formData,
        proposedPrice: formData.proposedPrice ? Number(formData.proposedPrice) : undefined,
        estimatedDays: formData.estimatedDays ? Number(formData.estimatedDays) : undefined,
      });
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        message: '',
        proposedPrice: undefined,
        estimatedDays: undefined,
        portfolioLinks: [],
        experience: '',
      });
    } catch (err: any) {
      console.error('Failed to create response:', err);
      setError(err.response?.data?.message || 'Ошибка при создании отклика');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Откликнуться на заказ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dealTitle}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="message"
              label="Сопроводительное письмо"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={4}
              required
              fullWidth
              placeholder="Расскажите, почему вы подходите для этого заказа. Опишите свой опыт и подход к работе."
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="proposedPrice"
                label="Предлагаемая цена (₽)"
                type="number"
                value={formData.proposedPrice || ''}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 100 }}
              />
              <TextField
                name="estimatedDays"
                label="Срок выполнения (дней)"
                type="number"
                value={formData.estimatedDays || ''}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Box>

            <TextField
              name="experience"
              label="Релевантный опыт"
              value={formData.experience}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              placeholder="Опишите ваш опыт работы с подобными заказами"
            />

            <Typography variant="caption" color="text.secondary">
              * После отправки отклика заказчик получит уведомление и сможет связаться с вами через
              менеджера
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.message}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Отправка...' : 'Отправить отклик'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

