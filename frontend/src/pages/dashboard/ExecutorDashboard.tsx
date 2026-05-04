import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { DealsService } from '@/services/deals.service';
import { ProfilesService } from '@/services/profiles.service';
import { IDeal } from '@/types/detail-deal.types';
import { useProfile } from '@/hooks/useProfile';

const ExecutorDashboard: React.FC = () => {
  const { user } = useProfile();
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load executor deals
      const myDeals = await DealsService.getExecutorDeals();
      setDeals(myDeals);

      // Removed - not used in new business model

      // Load executor profile
      try {
        if (user?.id) {
          const profileData = await ProfilesService.getProfileByUserId(user.id);
          setProfile(profileData);
        }
      } catch (err) {
        console.log('Profile not found');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDeals = deals.filter(d => d.status === 'IN_PROGRESS');
  const completedDeals = deals.filter(d => d.status === 'COMPLETED');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Панель исполнителя
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Создавайте объявления о своих услугах и управляйте ими
        </Typography>
      </Box>

      {/* Profile Status */}
      {!profile ? (
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4, bgcolor: 'warning.light' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Создайте свой профиль исполнителя
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Заполните информацию о себе, добавьте оборудование и портфолио, чтобы получать заказы от заказчиков
              </Typography>
              <LinearProgress variant="determinate" value={0} sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Профиль не заполнен (0%)
              </Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: '200px' } }}>
              <Button
                component={Link}
                to="/profiles/create"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<BuildIcon />}
              >
                Создать профиль
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'center', sm: 'flex-start' } }}>
            <Avatar
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                bgcolor: 'secondary.main',
                fontSize: '2rem',
              }}
            >
              {profile.companyName?.charAt(0) || user?.email?.charAt(0) || 'E'}
            </Avatar>
            
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h6" fontWeight={600}>
                {profile.companyName || user?.email}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} gap={2} mt={1}>
                <Box display="flex" alignItems="center">
                  <StarIcon sx={{ color: 'warning.main', mr: 0.5 }} />
                  <Typography variant="body2">{profile.rating.toFixed(1)}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {profile.completedDeals} завершенных заказов
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                component={Link}
                to="/profiles/create"
                variant="outlined"
                startIcon={<BuildIcon />}
                fullWidth
              >
                Редактировать профиль
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Stats */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}
      >
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {activeDeals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                В работе
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
              <WorkIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {completedDeals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Завершено
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                <StarIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {deals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Моих объявлений
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
              <AssignmentIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={600} color="secondary.main">
                {profile?.rating.toFixed(1) || '0.0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Рейтинг
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
              <StarIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Быстрые действия
        </Typography>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2
          }}
        >
          <Button
            component={Link}
            to="/executor/deals"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<WorkIcon />}
            sx={{ py: 2 }}
          >
            Мои заказы
          </Button>

          <Button
            component={Link}
            to="/deals"
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<AssignmentIcon />}
            sx={{ py: 2 }}
          >
            Найти заказы
          </Button>

          <Button
            component={Link}
            to="/announcements/create"
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<AddIcon />}
            sx={{ py: 2 }}
          >
            Создать объявление
          </Button>

          <Button
            component={Link}
            to="/profiles/create"
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<BuildIcon />}
            sx={{ py: 2 }}
          >
            {profile ? 'Редактировать профиль' : 'Создать профиль'}
          </Button>
        </Box>
      </Box>

      {/* Active Deals */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Активные заказы
          </Typography>
          <Button
            component={Link}
            to="/executor/deals"
            variant="text"
            endIcon={<VisibilityIcon />}
          >
            Посмотреть все
          </Button>
        </Box>
        {activeDeals.length === 0 ? (
          <Paper elevation={1} sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет активных заказов
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Откликайтесь на заказы клиентов или создавайте объявления о своих услугах
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/deals"
                variant="contained"
                size="large"
                startIcon={<AssignmentIcon />}
              >
                Найти заказы
              </Button>
              <Button
                component={Link}
                to="/announcements/create"
                variant="outlined"
                size="large"
                startIcon={<AddIcon />}
              >
                Создать объявление
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3
            }}
          >
            {deals.map((deal) => (
              <Card elevation={2} key={deal.id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {deal.title}
                    </Typography>
                    <Chip 
                      label={deal.status === 'ACTIVE' ? 'Активно' : deal.status} 
                      color={deal.status === 'ACTIVE' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2} sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {deal.description?.substring(0, 100)}...
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip label={deal.category} size="small" />
                    {deal.budget && (
                      <Typography variant="body1" fontWeight={600} color="primary.main">
                        от {deal.budget} ₽
                      </Typography>
                    )}
                  </Box>
                  <Button
                    component={Link}
                    to={`/deals/${deal.id}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ExecutorDashboard;