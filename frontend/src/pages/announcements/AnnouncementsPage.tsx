import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  InputAdornment,
  Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Add as AddIcon,
  LocalOffer as PriceIcon
} from '@mui/icons-material'
import { announcementsService } from '@/services/announcements.service'
import { useProfile } from '@/hooks/useProfile'
import { UserRole } from '@/services/auth/auth.types'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    category: '',
    region: '',
    search: '',
    isUrgent: undefined as boolean | undefined
  })
  const navigate = useNavigate()
  const { user } = useProfile()

  useEffect(() => {
    loadAnnouncements()
  }, [searchParams])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const params = {
        ...searchParams,
        isUrgent: searchParams.isUrgent === true ? true : undefined
      }
      const data = await announcementsService.getAll(params)
      setAnnouncements(data)
    } catch (error) {
      console.error('Failed to load announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const isExecutor = user?.roles?.includes(UserRole.EXECUTOR)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Объявления от исполнителей
        </Typography>
        {isExecutor && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/announcements/create')}
            sx={{ px: 3 }}
          >
            Создать объявление
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Поиск по названию..."
              value={searchParams.search}
              onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Категория"
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Регион"
              value={searchParams.region}
              onChange={(e) => setSearchParams({ ...searchParams, region: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant={searchParams.isUrgent ? 'contained' : 'outlined'}
              color={searchParams.isUrgent ? 'error' : 'inherit'}
              onClick={() => setSearchParams({ 
                ...searchParams, 
                isUrgent: searchParams.isUrgent ? undefined : true 
              })}
              sx={{ height: '56px' }}
            >
              {searchParams.isUrgent ? '🔥 Срочные' : 'Показать срочные'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Announcements List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : announcements.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Объявления не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Попробуйте изменить параметры поиска
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {announcements.map((announcement) => {
            const uploadsUrl = import.meta.env.VITE_NODE_ENV === 'production' 
              ? 'https://dd.ilyacode.ru' 
              : 'http://localhost:4200';
            const firstImage = announcement.images && announcement.images.length > 0 ? announcement.images[0] : null;
            
            return (
            <Grid item xs={12} sm={6} lg={4} key={announcement.id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    elevation: 8,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {announcement.isUrgent && (
                  <Box sx={{ bgcolor: 'error.main', color: 'white', px: 2, py: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold">
                      🔥 СРОЧНОЕ
                    </Typography>
                  </Box>
                )}
                
                {/* Image Preview */}
                {firstImage && (
                  <Box
                    component="img"
                    src={`${uploadsUrl}${firstImage}`}
                    alt={announcement.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {announcement.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {announcement.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<CategoryIcon />} 
                      label={announcement.category} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                    {announcement.region && (
                      <Chip 
                        icon={<LocationIcon />} 
                        label={announcement.region} 
                        size="small"
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {announcement.priceFrom && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PriceIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          от <strong>{announcement.priceFrom} ₽</strong>
                        </Typography>
                      </Box>
                    )}
                    {announcement.estimatedDays && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {announcement.estimatedDays} дней
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Исполнитель
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {announcement.executor?.fullName || announcement.executor?.login}
                    </Typography>
                    {announcement.executor?.profile?.rating > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="caption">
                          {announcement.executor.profile.rating.toFixed(1)} ({announcement.executor.profile.totalReviews})
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/announcements/${announcement.id}`)}
                    sx={{ flex: 1 }}
                  >
                    Подробнее
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => navigate(`/announcements/${announcement.id}`)}
                    sx={{ flex: 1 }}
                  >
                    Связаться
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  )
}

