import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Paper,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material'
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Gavel as GavelIcon,
  Campaign as CampaignIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { managerService } from '@/services/manager.service'
import { useProfile } from '@/hooks/useProfile'

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useProfile()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await managerService.getDashboardStats()
      setStats(data)
    } catch (error: any) {
      console.error('Failed to load stats:', error)
      setError(error.message || 'Ошибка загрузки данных')
      // Set default stats for display
      setStats({
        users: { total: 0, customers: 0, executors: 0 },
        deals: { total: 0, active: 0, inProgress: 0 },
        complaints: { total: 0, pending: 0 },
        chats: { total: 0, active: 0, myChats: 0 },
        announcements: { total: 0, active: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Панель управления менеджера
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Добро пожаловать, {user?.login}!
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} (отображаются данные по умолчанию)
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardActionArea onClick={() => navigate('/deals')}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Пользователи
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {stats?.users?.total || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Клиенты: {stats?.users?.customers || 0} | Исполнители: {stats?.users?.executors || 0}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardActionArea onClick={() => navigate('/deals')}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Активные заказы
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
                      {stats?.deals?.active || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Всего: {stats?.deals?.total || 0}
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardActionArea onClick={() => navigate('/complaints')}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Ожидают ответа
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="error.main" sx={{ mb: 1 }}>
                      {stats?.complaints?.pending || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Всего жалоб: {stats?.complaints?.total || 0}
                    </Typography>
                  </Box>
                  <WarningIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardActionArea onClick={() => navigate('/manager/chats')}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Мои чаты
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="info.main" sx={{ mb: 1 }}>
                      {stats?.chats?.myChats || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Всего чатов: {stats?.chats?.total || 0}
                    </Typography>
                  </Box>
                  <ChatIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon color="primary" />
          Быстрые действия
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ChatIcon />}
              onClick={() => navigate('/manager/chats')}
              sx={{ py: 1.5 }}
            >
              Все чаты
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/deals')}
              sx={{ py: 1.5 }}
            >
              Заказы
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/profiles')}
              sx={{ py: 1.5 }}
            >
              Пользователи
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              size="large"
              startIcon={<WarningIcon />}
              onClick={() => navigate('/complaints')}
              sx={{ py: 1.5 }}
            >
              Жалобы
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu Sections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon color="primary" />
              Управление
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List sx={{ p: 0 }}>
              <ListItemButton onClick={() => navigate('/profiles')}>
                <ListItemIcon>
                  <PeopleIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Клиенты" secondary="Управление клиентами" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/profiles')}>
                <ListItemIcon>
                  <BusinessIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Исполнители" secondary="Управление исполнителями" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/announcements')}>
                <ListItemIcon>
                  <CampaignIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Объявления" secondary="Модерация объявлений" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/deals')}>
                <ListItemIcon>
                  <GavelIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Споры" secondary="Разрешение споров" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="success" />
              Мониторинг
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List sx={{ p: 0 }}>
              <ListItemButton onClick={() => navigate('/manager/chats')}>
                <ListItemIcon>
                  <ChatIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Активные чаты" secondary="Чаты требующие внимания" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/deals')}>
                <ListItemIcon>
                  <AssignmentIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Заказы в работе" secondary="Текущие активные заказы" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/complaints')}>
                <ListItemIcon>
                  <ErrorIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Новые жалобы" secondary="Ожидают рассмотрения" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <CheckCircleIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Завершенные сделки" secondary="История операций" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="warning" />
              Уведомления
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List sx={{ p: 0 }}>
              <ListItemButton>
                <ListItemIcon>
                  <WarningIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Срочные жалобы" 
                  secondary={`${stats?.complaints?.pending || 0} требуют внимания`}
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/manager/chats')}>
                <ListItemIcon>
                  <ChatIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Непрочитанные сообщения" 
                  secondary="Проверьте активные чаты"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="Заказы без исполнителя" 
                  secondary="Требуется модерация"
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <HistoryIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Журнал активности" 
                  secondary="Последние действия"
                />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

