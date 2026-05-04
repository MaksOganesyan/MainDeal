import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Rating,
  Divider,
  Alert,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  RemoveRedEye as ViewsIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Chat as ChatIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import { announcementsService } from '@/services/announcements.service'

export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [announcement, setAnnouncement] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const getUploadsUrl = () => {
    return import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://dd.ilyacode.ru'
      : 'http://localhost:4200';
  };

  useEffect(() => {
    if (id) {
      loadAnnouncement()
    }
  }, [id])

  const loadAnnouncement = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await announcementsService.getOne(Number(id))
      setAnnouncement(data)
    } catch (error: any) {
      console.error('Failed to load announcement:', error)
      setError(error.response?.data?.message || 'Не удалось загрузить объявление')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    navigate(`/chats/new?announcementId=${id}`)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !announcement) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Объявление не найдено'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/announcements')}
        >
          Вернуться к объявлениям
        </Button>
      </Container>
    )
  }

  const uploadsUrl = getUploadsUrl();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/announcements')}
        sx={{ mb: 3 }}
      >
        Назад к объявлениям
      </Button>

      {/* Main Card */}
      <Paper elevation={3} sx={{ overflow: 'hidden', mb: 3 }}>
        {/* Header with gradient */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={2}>
            <Box flex={1}>
              {announcement.isUrgent && (
                <Chip
                  label="🔥 Срочное"
                  color="error"
                  size="small"
                  sx={{ mb: 2, fontWeight: 600 }}
                />
              )}
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {announcement.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CategoryIcon />
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {announcement.category}
                </Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              {announcement.priceFrom && (
                <Typography variant="h3" fontWeight={700}>
                  от {announcement.priceFrom} ₽
                </Typography>
              )}
              {announcement.priceTo && (
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  до {announcement.priceTo} ₽
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          {/* Description */}
          <Box mb={4}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Описание услуги
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
            >
              {announcement.description}
            </Typography>
          </Box>

          {/* Details Grid */}
          <Grid container spacing={3} mb={4}>
            {/* Service Details */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ bgcolor: 'grey.50', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Детали услуги
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    {announcement.estimatedDays && (
                      <Box display="flex" alignItems="center" gap={2}>
                        <TimeIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Срок выполнения
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {announcement.estimatedDays} дней
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {announcement.region && (
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocationIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Регион
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {announcement.region}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {announcement.location && (
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocationIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Адрес
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {announcement.location}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    <Box display="flex" alignItems="center" gap={2}>
                      <ViewsIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Просмотров
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {announcement.views}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Executor Info */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ bgcolor: 'primary.50', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Исполнитель
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        {announcement.executor?.fullName?.charAt(0) || announcement.executor?.login?.charAt(0) || 'И'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {announcement.executor?.fullName || announcement.executor?.login}
                        </Typography>
                        {announcement.executor?.profile?.rating > 0 && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Rating
                              value={announcement.executor.profile.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                              ({announcement.executor.profile.totalReviews})
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {announcement.executor?.profile?.completedDeals > 0 && (
                      <Box display="flex" alignItems="center" gap={2}>
                        <WorkIcon color="action" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Выполнено заказов
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {announcement.executor.profile.completedDeals}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {announcement.executor?.profile?.specializations &&
                      announcement.executor.profile.specializations.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Специализации
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {announcement.executor.profile.specializations.map((spec: string, idx: number) => (
                              <Chip key={idx} label={spec} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Images */}
          {announcement.images && announcement.images.length > 0 && (
            <Box mb={4}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Фотографии работ
              </Typography>
              <Grid container spacing={2} mt={1}>
                {announcement.images.map((image: string, idx: number) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                      onClick={() => window.open(`${uploadsUrl}${image}`, '_blank')}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${uploadsUrl}${image}`}
                        alt={`Фото ${idx + 1}`}
                        sx={{ objectFit: 'cover' }}
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Contact Button */}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<ChatIcon />}
              onClick={handleContact}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              Связаться с исполнителем
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Important Info */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ bgcolor: 'info.50' }}>
        <Typography variant="body2" fontWeight={500}>
          Все коммуникации проходят через менеджера для обеспечения безопасности сделки.
          Запрещено передавать личные контактные данные в чате.
        </Typography>
      </Alert>
    </Container>
  )
}
