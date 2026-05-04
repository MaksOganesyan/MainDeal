import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import UserService from '@/services/user.service';
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';

const UserSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useProfile();
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && !initialized) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
      setInitialized(true);
    }
  }, [user, initialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await UserService.updateProfile(formData);
      setSuccess(true);
      // Обновляем страницу через 1.5 секунды
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={formData.avatar ? `${import.meta.env.VITE_SERVER_URL || 'http://localhost:4200'}${formData.avatar}` : undefined}
            sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
          >
            {!formData.avatar && <PersonIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Настройки профиля
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Обновите информацию о вашем аккаунте
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Avatar Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Аватар
          </Typography>
          <ImageUpload
            endpoint="avatar"
            multiple={false}
            onUploadSuccess={(urls) => {
              setFormData(prev => ({ ...prev, avatar: urls[0] }));
            }}
            existingImages={formData.avatar ? [formData.avatar] : []}
            onRemoveImage={() => {
              setFormData(prev => ({ ...prev, avatar: '' }));
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Профиль успешно обновлен! Страница перезагрузится...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Email (read-only) */}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              fullWidth
              helperText="Email нельзя изменить"
            />

            {/* Full Name */}
            <TextField
              label="Полное имя"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Phone */}
            <TextField
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              placeholder="+7 (999) 123-45-67"
            />

            {/* Role info */}
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Роли в системе:
              </Typography>
              {user?.roles?.map((role) => (
                <Typography key={role} variant="body2" sx={{ ml: 2 }}>
                  • {role === 'CUSTOMER' ? 'Заказчик' : role === 'EXECUTOR' ? 'Исполнитель' : role === 'MANAGER' ? 'Менеджер' : role}
                </Typography>
              ))}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Additional info for executors */}
        {user?.isExecutor && (
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Профиль исполнителя
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Управляйте профилем исполнителя, добавляйте оборудование и портфолио
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/profiles/create')}
            >
              Редактировать профиль исполнителя
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserSettingsPage;

