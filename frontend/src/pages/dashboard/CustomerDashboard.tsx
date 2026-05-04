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
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { DealsService } from '@/services/deals.service';
import { IDeal } from '@/types/detail-deal.types';

const CustomerDashboard: React.FC = () => {
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyDeals();
  }, []);

  const loadMyDeals = async () => {
    try {
      setLoading(true);
      const data = await DealsService.getMyDeals();
      setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDeals = deals.filter(d => d.status === 'ACTIVE' || d.status === 'IN_PROGRESS');
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
          Мои заказы
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управляйте вашими заказами на металлообработку
        </Typography>
      </Box>

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
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {deals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всего заказов
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
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {activeDeals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                В работе
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
              <AccessTimeIcon sx={{ fontSize: 32 }} />
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
              <CheckCircleIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        </Paper>
        
        <Paper elevation={2} sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Создать заказ
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Разместите новый
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/deals/create"
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              <AddIcon />
            </Button>
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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2
          }}
        >
          <Button
            component={Link}
            to="/deals/create"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<AddIcon />}
            sx={{ py: 2 }}
          >
            Разместить новый заказ
          </Button>

          <Button
            component={Link}
            to="/profiles"
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<TrendingUpIcon />}
            sx={{ py: 2 }}
          >
            Найти исполнителя
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
            Все заказы на рынке
          </Button>
        </Box>
      </Box>

      {/* Recent Deals */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Последние заказы
        </Typography>
        {deals.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет заказов
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Создайте первый заказ, чтобы найти исполнителя
            </Typography>
            <Button
              component={Link}
              to="/deals/create"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
            >
              Создать первый заказ
            </Button>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3
            }}
          >
            {deals.slice(0, 6).map((deal) => (
              <Card elevation={2} key={deal.id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      {deal.title}
                    </Typography>
                    <Chip
                      label={deal.status}
                      color={
                        deal.status === 'COMPLETED'
                          ? 'success'
                          : deal.status === 'IN_PROGRESS'
                          ? 'warning'
                          : 'default'
                      }
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
                    {deal.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Категория: {deal.category}
                    </Typography>
                    {deal.budget && (
                      <Typography variant="body1" fontWeight={600} color="primary.main">
                        {deal.budget} ₽
                      </Typography>
                    )}
                  </Box>
                  <Box mt={2}>
                    <Button
                      component={Link}
                      to={`/deals/${deal.id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      Подробнее
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CustomerDashboard;