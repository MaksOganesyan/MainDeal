import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Web as WebIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProfilesService, CreateProfileDto } from '@/services/profiles.service';

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProfileDto>({
    companyName: '',
    specializations: [],
    experience: undefined,
    description: '',
    website: '',
    isPublic: true,
    showContactInfo: false, // Всегда false, контакты скрыты
  });
  const [newSpecialization, setNewSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularSpecializations = [
    'Токарные работы',
    'Фрезерные работы',
    'Сварочные работы',
    'Листогибочные работы',
    'Лазерная резка',
    'Плазменная резка',
    'Гибка труб',
    'Штамповка',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' && value ? Number(value) : value,
    }));
  };

  const handleAddSpecialization = (spec?: string) => {
    const specializationToAdd = spec || newSpecialization.trim();
    if (specializationToAdd && !formData.specializations?.includes(specializationToAdd)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...(prev.specializations || []), specializationToAdd],
      }));
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ProfilesService.createProfile(formData);
      navigate('/dashboard/executor');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании профиля');
      console.error('Error creating profile:', err);
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
          Создание профиля исполнителя
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Заполните информацию о вашей компании и услугах
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
            {/* Section: Basic Info */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Основная информация
              </Typography>
            </Box>

            {/* Company Name */}
            <Box>
              <TextField
                required
                fullWidth
                label="Название компании"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="ООО 'Металлообработка' или ИП Иванов"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <TextField
                required
                fullWidth
                multiline
                rows={5}
                label="Описание услуг"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Подробно опишите ваши услуги, преимущества, опыт работы..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Experience and Website Row */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 2.5, sm: 3 } 
            }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Опыт работы (лет)"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="url"
                  label="Веб-сайт (необязательно)"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-site.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WebIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* Section: Specializations */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Специализации
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Выберите из популярных или добавьте свою
              </Typography>
            </Box>

            {/* Popular Specializations */}
            <Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {popularSpecializations.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    onClick={() => handleAddSpecialization(spec)}
                    variant={formData.specializations?.includes(spec) ? 'filled' : 'outlined'}
                    color={formData.specializations?.includes(spec) ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Add Custom Specialization */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2 
            }}>
              <TextField
                fullWidth
                placeholder="Или добавьте свою специализацию"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialization())}
              />
              <Button
                variant="outlined"
                onClick={() => handleAddSpecialization()}
                startIcon={<AddIcon />}
                sx={{ 
                  minWidth: { xs: '100%', sm: '130px' },
                  whiteSpace: 'nowrap' 
                }}
              >
                Добавить
              </Button>
            </Box>

            {/* Selected Specializations */}
            {formData.specializations && formData.specializations.length > 0 && (
              <Box>
                <Typography variant="body2" fontWeight={500} mb={1.5}>
                  Выбранные специализации:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.specializations.map((spec, index) => (
                    <Chip
                      key={index}
                      label={spec}
                      onDelete={() => handleRemoveSpecialization(index)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Section: Privacy Settings */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Настройки приватности
              </Typography>
            </Box>

            {/* Public Profile Toggle */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, isPublic: e.target.checked }))
                    }
                  />
                }
                label="Сделать профиль публичным"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                Ваш профиль будет виден всем заказчикам
              </Typography>
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
                {loading ? 'Создание профиля...' : 'Создать профиль'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate('/dashboard/executor')}
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
          💡 Советы по созданию профиля
        </Typography>
        <Box component="ul" sx={{ pl: { xs: 2, sm: 2.5 }, mb: 0 }}>
          <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
            Укажите все ваши специализации для лучшей видимости
          </Typography>
          <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
            Подробно опишите ваш опыт и преимущества
          </Typography>
          <Typography component="li" variant="body2" mb={1} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
            Добавьте ссылку на ваш сайт или портфолио
          </Typography>
          <Typography component="li" variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
            После создания профиля вы сможете добавить оборудование и портфолио
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProfilePage;
