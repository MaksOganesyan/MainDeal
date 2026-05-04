import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DealsService, CreateDealDto } from '@/services/deals.service';
import { useProfile } from '@/hooks/useProfile';
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';

const CreateDealPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateDealDto>({
    title: '',
    description: '',
    category: '',
    materials: [],
    budget: undefined,
    deadline: undefined,
    location: '',
    isUrgent: false,
    attachments: [],
  });
  const [materialInput, setMaterialInput] = useState('');

  const categories = [
    'Токарные работы',
    'Фрезерные работы',
    'Сварочные работы',
    'Листогибочные работы',
    'Лазерная резка',
    'Плазменная резка',
    'Гибка труб',
    'Штамповка',
    'Другое',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMaterial = () => {
    if (materialInput.trim() && !formData.materials?.includes(materialInput.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...(prev.materials || []), materialInput.trim()],
      }));
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await DealsService.createDeal(formData);
      if (user?.isExecutor) {
        navigate('/dashboard/executor');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Ошибка при создании ${user?.isExecutor ? 'объявления' : 'заказа'}`);
      console.error('Error creating deal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box mb={{ xs: 3, md: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={600} 
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}
        >
          {user?.isExecutor ? 'Создать объявление об услуге' : 'Разместить новый заказ'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {user?.isExecutor 
            ? 'Опишите услуги, которые вы предлагаете'
            : 'Заполните информацию о вашем заказе на металлообработку'
          }
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
            {/* Title */}
            <Box>
              <TextField
                required
                fullWidth
                label={user?.isExecutor ? 'Название услуги' : 'Название заказа'}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={user?.isExecutor 
                  ? 'Например: Токарные работы любой сложности' 
                  : 'Например: Изготовление металлического каркаса'
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Category and Budget Row */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 2.5, sm: 3 } 
            }}>
              <Box sx={{ flex: 1 }}>
                <FormControl required fullWidth>
                  <InputLabel>Категория</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Категория"
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    startAdornment={
                      <InputAdornment position="start">
                        <CategoryIcon />
                      </InputAdornment>
                    }
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={user?.isExecutor ? 'Стоимость от (₽)' : 'Бюджет (₽)'}
                  name="budget"
                  value={formData.budget || ''}
                  onChange={handleInputChange}
                  helperText={user?.isExecutor ? 'Минимальная стоимость услуги' : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box>
              <TextField
                required
                fullWidth
                multiline
                rows={6}
                label={user?.isExecutor ? 'Описание услуги' : 'Описание заказа'}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={user?.isExecutor
                  ? 'Подробно опишите ваши услуги, опыт, возможности оборудования...'
                  : 'Подробно опишите требования к работе, размеры, материалы, количество и другие важные детали...'
                }
              />
            </Box>

            {/* Materials */}
            <Box>
              <Typography variant="body1" fontWeight={500} mb={1.5}>
                Материалы
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2, 
                  mb: 2 
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Добавить материал (например: Сталь 3мм)"
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddMaterial}
                  startIcon={<AddIcon />}
                  sx={{ 
                    minWidth: { xs: '100%', sm: '130px' },
                    whiteSpace: 'nowrap' 
                  }}
                >
                  Добавить
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.materials?.map((material, index) => (
                  <Chip
                    key={index}
                    label={material}
                    onDelete={() => handleRemoveMaterial(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* Location and Deadline Row */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 2.5, sm: 3 } 
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Местоположение"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Город"
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Срок выполнения"
                  name="deadline"
                  value={formData.deadline || ''}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* Specifications */}
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Технические требования (необязательно)"
                name="specifications"
                value={formData.specifications || ''}
                onChange={handleInputChange}
                placeholder="Дополнительные технические характеристики, стандарты, допуски..."
              />
            </Box>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Изображения
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Добавьте фотографии чертежей, образцов или требований к заказу
              </Typography>
              <ImageUpload
                endpoint="deal"
                multiple={true}
                maxFiles={10}
                onUploadSuccess={(urls) => {
                  setFormData(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), ...urls],
                  }));
                }}
                existingImages={formData.attachments || []}
                onRemoveImage={(url) => {
                  setFormData(prev => ({
                    ...prev,
                    attachments: (prev.attachments || []).filter(img => img !== url),
                  }));
                }}
              />
            </Box>

            {/* Error Alert */}
            {error && (
              <Box>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {/* Buttons */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mt: 2
            }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                sx={{ 
                  py: 1.5,
                  flex: { sm: 2 }
                }}
              >
                {loading 
                  ? (user?.isExecutor ? 'Создание объявления...' : 'Создание заказа...') 
                  : (user?.isExecutor ? 'Разместить объявление' : 'Разместить заказ')
                }
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate(user?.isExecutor ? '/dashboard/executor' : '/dashboard/customer')}
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  flex: { sm: 1 }
                }}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Info Box */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mt: { xs: 2, sm: 3 }, 
          bgcolor: 'info.light',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight={600} 
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          💡 {user?.isExecutor ? 'Советы по созданию объявления' : 'Советы по созданию заказа'}
        </Typography>
        <Box component="ul" sx={{ pl: { xs: 2, sm: 2.5 }, mb: 0 }}>
          {user?.isExecutor ? (
            <>
              <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Подробно опишите ваши услуги и возможности
              </Typography>
              <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Укажите типы работ и материалы, с которыми работаете
              </Typography>
              <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Установите конкурентную цену за услуги
              </Typography>
              <Typography component="li" variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Чем подробнее объявление, тем больше заказчиков свяжутся с вами
              </Typography>
            </>
          ) : (
            <>
              <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Укажите максимально подробное описание работ
              </Typography>
              <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Добавьте точные размеры и количество изделий
              </Typography>
              <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Укажите реальный бюджет для привлечения исполнителей
              </Typography>
              <Typography component="li" variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                Чем подробнее заказ, тем быстрее найдется исполнитель
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateDealPage;