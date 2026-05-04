import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Rating
} from '@mui/material'
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material'
import { api } from '@/api/axios'

interface UserRatingData {
  profile: any;
  reviews: any[];
  stats: {
    asExecutor: {
      total: number;
      completed: number;
      inProgress: number;
      cancelled: number;
      totalEarned: number;
      completionRate: number;
      avgCompletionTime: number;
    };
    asCustomer: {
      total: number;
      completed: number;
      inProgress: number;
      cancelled: number;
      totalSpent: number;
    };
    reviews: {
      total: number;
      averageRating: number;
      ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
      };
    };
  };
}

interface UserRatingProps {
  userId: number;
}

export default function UserRating({ userId }: UserRatingProps) {
  const [data, setData] = useState<UserRatingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserRating()
  }, [userId])

  const loadUserRating = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/profiles/rating/${userId}`)
      setData(response.data)
    } catch (error: any) {
      console.error('Failed to load user rating:', error)
      setError('Не удалось загрузить рейтинг пользователя')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success.main'
    if (rating >= 3.5) return 'info.main'
    if (rating >= 2.5) return 'warning.main'
    return 'error.main'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !data) {
    return <Alert severity="error">{error || 'Не удалось загрузить данные'}</Alert>
  }

  const { profile, reviews, stats } = data

  return (
    <Box>
      {/* Header with User Info */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={profile?.user?.avatar}
            sx={{ width: 80, height: 80 }}
          >
            {profile?.user?.fullName?.[0] || profile?.user?.login?.[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {profile?.user?.fullName || profile?.user?.login}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating 
                  value={stats.reviews.averageRating} 
                  precision={0.1} 
                  readOnly 
                  size="small"
                />
                <Typography variant="h6" fontWeight="bold" sx={{ color: getRatingColor(stats.reviews.averageRating) }}>
                  {stats.reviews.averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                ({stats.reviews.total} {stats.reviews.total === 1 ? 'отзыв' : 'отзывов'})
              </Typography>
            </Box>
            {profile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Зарегистрирован: {new Date(profile.user.registeredAt).toLocaleDateString('ru-RU')}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Как исполнитель</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Всего заказов
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.asExecutor.total}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Завершено
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {stats.asExecutor.completed}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    В работе
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.asExecutor.inProgress}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    % завершения
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {stats.asExecutor.completionRate.toFixed(0)}%
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon color="success" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Заработано
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(stats.asExecutor.totalEarned)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Как заказчик</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Всего заказов
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.asCustomer.total}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Завершено
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {stats.asCustomer.completed}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    В работе
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.asCustomer.inProgress}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Отменено
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.secondary">
                    {stats.asCustomer.cancelled}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon color="info" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Потрачено
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(stats.asCustomer.totalSpent)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rating Distribution */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Распределение оценок
        </Typography>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = stats.reviews.ratingDistribution[rating as keyof typeof stats.reviews.ratingDistribution]
          const percentage = stats.reviews.total > 0 ? (count / stats.reviews.total) * 100 : 0
          return (
            <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                <Typography variant="body2" sx={{ mr: 0.5 }}>{rating}</Typography>
                <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              </Box>
              <Box sx={{ flex: 1, mx: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={percentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                {count}
              </Typography>
            </Box>
          )
        })}
      </Paper>

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Последние отзывы
          </Typography>
          {reviews.map(review => (
            <Box key={review.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar 
                  src={review.author?.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {review.author?.fullName?.[0] || review.author?.login?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {review.author?.fullName || review.author?.login}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </Typography>
                  </Box>
                </Box>
                {review.deal && (
                  <Chip 
                    label={review.deal.category} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
              {review.comment && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
              )}
              {review.pros && review.pros.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="success.main">
                    Плюсы:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {review.pros.map((pro: string, i: number) => (
                      <Chip 
                        key={i} 
                        label={pro} 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              {review.cons && review.cons.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="error.main">
                    Минусы:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {review.cons.map((con: string, i: number) => (
                      <Chip 
                        key={i} 
                        label={con} 
                        size="small" 
                        color="error" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  )
}

