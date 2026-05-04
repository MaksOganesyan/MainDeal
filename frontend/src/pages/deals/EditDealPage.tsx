import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  InputAdornment,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DealsService } from '@/services/deals.service';
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';

const categories = [
  'Токарные работы',
  'Фрезерные работы',
  'Сварочные работы',
  'Слесарные работы',
  'Монтажные работы',
  'Другое',
];

export default function EditDealPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    materials: [] as string[],
    specifications: '',
    budget: '',
    deadline: '',
    estimatedTime: '',
    location: '',
    isUrgent: false,
    attachments: [] as string[],
  });

  const [materialInput, setMaterialInput] = useState('');

  const loadDeal = useCallback(async () => {
    if (!id) {
      setError('ID заказа не указан');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const deal = await DealsService.getDeal(Number(id));
      
      if (!deal) {
        setError('Заказ не найден');
        return;
      }
      
      setFormData({
        title: deal.title || '',
        description: deal.description || '',
        category: deal.category || '',
        materials: deal.materials || [],
        specifications: deal.specifications || '',
        budget: deal.budget?.toString() || '',
        deadline: deal.deadline ? new Date(deal.deadline).toISOString().split('T')[0] : '',
        estimatedTime: deal.estimatedTime?.toString() || '',
        location: deal.location || '',
        isUrgent: deal.isUrgent || false,
        attachments: deal.attachments || [],
      });
    } catch (error: any) {
      console.error('Failed to load deal:', error);
      setError(error.response?.data?.message || 'Не удалось загрузить заказ');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDeal();
  }, [loadDeal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMaterial = () => {
    if (materialInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, materialInput.trim()],
      }));
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        materials: formData.materials,
        specifications: formData.specifications || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        deadline: formData.deadline || undefined,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
        location: formData.location || undefined,
        isUrgent: formData.isUrgent,
        attachments: formData.attachments,
      };

      await DealsService.updateDeal(Number(id), updateData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/deals/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to update deal:', error);
      setError(error.response?.data?.message || 'Ошибка при обновлении заказа');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !formData.title) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/deals')}>
          Вернуться к списку заказов
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Редактировать заказ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Обновите информацию о заказе
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Заказ успешно обновлен! Перенаправление...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Название заказа"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="Категория"
              name="category"
              value={formData.category}
              onChange={handleChange}
              select
              required
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Materials */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Материалы
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  placeholder="Добавить материал"
                  size="small"
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMaterial();
                    }
                  }}
                />
                <Button onClick={handleAddMaterial} variant="outlined">
                  Добавить
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.materials.map((material, index) => (
                  <Chip
                    key={index}
                    label={material}
                    onDelete={() => handleRemoveMaterial(index)}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              label="Технические требования"
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Бюджет"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                }}
              />
              <TextField
                label="Расчетное время (дней)"
                name="estimatedTime"
                type="number"
                value={formData.estimatedTime}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <TextField
              label="Срок выполнения"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Местоположение"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Изображения
              </Typography>
              <ImageUpload
                endpoint="deal"
                multiple={true}
                maxFiles={10}
                onUploadSuccess={(urls) => {
                  setFormData((prev) => ({
                    ...prev,
                    attachments: [...prev.attachments, ...urls],
                  }));
                }}
                existingImages={formData.attachments}
                onRemoveImage={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    attachments: prev.attachments.filter((img) => img !== url),
                  }));
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/deals/${id}`)}
                disabled={submitting}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting && <CircularProgress size={20} />}
              >
                {submitting ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

