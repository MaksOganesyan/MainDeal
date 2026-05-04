import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { DealsService, DealHistory } from '@/services/deals.service'
import { useProfile } from '@/hooks/useProfile'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DealsHistoryPage() {
  const [historyData, setHistoryData] = useState<DealHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const { user } = useProfile()
  const navigate = useNavigate()

  const isExecutor = user?.roles?.includes('EXECUTOR')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = isExecutor 
        ? await DealsService.getExecutorHistory()
        : await DealsService.getCustomerHistory()
      setHistoryData(data)
    } catch (error: any) {
      console.error('Failed to load history:', error)
      setError('Не удалось загрузить историю заказов')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success'
      case 'IN_PROGRESS': return 'info'
      case 'ACTIVE': return 'warning'
      case 'CANCELLED': return 'default'
      case 'DISPUTE': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleIcon fontSize="small" />
      case 'IN_PROGRESS': return <HourglassIcon fontSize="small" />
      case 'ACTIVE': return <HourglassIcon fontSize="small" />
      case 'CANCELLED': return <CancelIcon fontSize="small" />
      case 'DISPUTE': return <ErrorIcon fontSize="small" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Завершен'
      case 'IN_PROGRESS': return 'В работе'
      case 'ACTIVE': return 'Активный'
      case 'CANCELLED': return 'Отменен'
      case 'DISPUTE': return 'Спор'
      default: return status
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  if (error || !historyData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Не удалось загрузить данные'}</Alert>
      </Container>
    )
  }

  const { deals, stats } = historyData

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isExecutor ? 'История работ' : 'История заказов'}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Всего заказов
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Завершено
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                В работе
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {isExecutor ? 'Заработано' : 'Потрачено'}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(stats.totalEarned || stats.totalSpent || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Средняя цена
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(stats.averagePrice)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {isExecutor && stats.averageRating !== undefined && (
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Средний рейтинг
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.averageRating.toFixed(1)} ⭐
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Активных
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Отменено
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="text.secondary">
                {stats.cancelled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Все" />
          <Tab label="Завершенные" />
          <Tab label="В работе" />
          <Tab label="Активные" />
          <Tab label="Отмененные" />
        </Tabs>
      </Paper>

      {/* Deals Table */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>{isExecutor ? 'Заказчик' : 'Исполнитель'}</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Цена</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((deal: any) => (
                <TableRow key={deal.id} hover>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{deal.category}</TableCell>
                  <TableCell>
                    {isExecutor 
                      ? (deal.customer?.fullName || deal.customer?.login)
                      : (deal.executor?.fullName || deal.executor?.login || 'Не назначен')
                    }
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(deal.status)}
                      label={getStatusText(deal.status)}
                      color={getStatusColor(deal.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {deal.price ? formatCurrency(deal.price) : 
                     deal.budget ? `≈${formatCurrency(deal.budget)}` : '-'}
                  </TableCell>
                  <TableCell>{formatDate(deal.createdAt)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>{isExecutor ? 'Заказчик' : 'Исполнитель'}</TableCell>
                <TableCell align="right">Цена</TableCell>
                <TableCell>Дата завершения</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.filter(d => d.status === 'COMPLETED').map((deal: any) => (
                <TableRow key={deal.id} hover>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{deal.category}</TableCell>
                  <TableCell>
                    {isExecutor 
                      ? (deal.customer?.fullName || deal.customer?.login)
                      : (deal.executor?.fullName || deal.executor?.login)
                    }
                  </TableCell>
                  <TableCell align="right">
                    {deal.price ? formatCurrency(deal.price) : '-'}
                  </TableCell>
                  <TableCell>{deal.completedAt ? formatDate(deal.completedAt) : '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>{isExecutor ? 'Заказчик' : 'Исполнитель'}</TableCell>
                <TableCell align="right">Цена</TableCell>
                <TableCell>Дата начала</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.filter(d => d.status === 'IN_PROGRESS').map((deal: any) => (
                <TableRow key={deal.id} hover>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{deal.category}</TableCell>
                  <TableCell>
                    {isExecutor 
                      ? (deal.customer?.fullName || deal.customer?.login)
                      : (deal.executor?.fullName || deal.executor?.login)
                    }
                  </TableCell>
                  <TableCell align="right">
                    {deal.price ? formatCurrency(deal.price) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(deal.createdAt)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Бюджет</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.filter(d => d.status === 'ACTIVE').map((deal: any) => (
                <TableRow key={deal.id} hover>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{deal.category}</TableCell>
                  <TableCell>
                    {deal.budget ? formatCurrency(deal.budget) : 'Не указан'}
                  </TableCell>
                  <TableCell>{formatDate(deal.createdAt)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>{isExecutor ? 'Заказчик' : 'Исполнитель'}</TableCell>
                <TableCell>Дата отмены</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.filter(d => d.status === 'CANCELLED').map((deal: any) => (
                <TableRow key={deal.id} hover>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{deal.category}</TableCell>
                  <TableCell>
                    {isExecutor 
                      ? (deal.customer?.fullName || deal.customer?.login)
                      : (deal.executor?.fullName || deal.executor?.login || 'Не назначен')
                    }
                  </TableCell>
                  <TableCell>{formatDate(deal.updatedAt)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {deals.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            У вас пока нет заказов
          </Typography>
        </Paper>
      )}
    </Container>
  )
}

