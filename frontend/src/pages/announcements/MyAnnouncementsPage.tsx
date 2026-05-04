import { useState, useEffect, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  RemoveRedEye as ViewsIcon,
} from '@mui/icons-material'
import { announcementsService } from '@/services/announcements.service'

export default function MyAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadMyAnnouncements()
  }, [])

  const loadMyAnnouncements = async () => {
    try {
      setLoading(true)
      const data = await announcementsService.getMy()
      setAnnouncements(data)
    } catch (error) {
      console.error('Failed to load my announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (id: number, isHidden: boolean) => {
    try {
      if (isHidden) {
        await announcementsService.show(id)
      } else {
        await announcementsService.hide(id)
      }
      loadMyAnnouncements()
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) {
      return
    }

    try {
      await announcementsService.delete(id)
      loadMyAnnouncements()
    } catch (error) {
      console.error('Failed to delete announcement:', error)
    }
  }

  const getUploadsUrl = () => {
    return import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://dd.ilyacode.ru'
      : 'http://localhost:4200';
  };

  const handleOpenMock = (id: number) => {
    navigate(`/ordercarddet/${id}`)
  }


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Мои объявления
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/announcements/create')}
        >
          Создать объявление
        </Button>
      </Box>

      {announcements.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас пока нет объявлений
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/announcements/create')}
            sx={{ mt: 2 }}
          >
            Создать первое объявление
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 3 }}>
          {announcements.map((announcement) => {
            const uploadsUrl = getUploadsUrl();
            const firstImage = announcement.images && announcement.images.length > 0 ? announcement.images[0] : null;

            return (
              <Box key={announcement.id}>
                <Card
                  elevation={2}
                  sx={{ 
                    opacity: announcement.isHidden ? 0.6 : 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenMock(announcement.id)}
                >
                  {firstImage && (
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: { xs: '100%', sm: 200 },
                        height: { xs: 200, sm: 'auto' },
                        objectFit: 'cover' 
                      }}
                      image={`${uploadsUrl}${firstImage}`}
                      alt={announcement.title}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {announcement.title}
                        </Typography>
                        {announcement.isUrgent && (
                          <Chip label="🔥 Срочное" color="error" size="small" />
                        )}
                        {announcement.isHidden && (
                          <Chip label="Скрыто" color="default" size="small" />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {announcement.description}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CategoryIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {announcement.category}
                          </Typography>
                        </Box>

                        {announcement.region && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {announcement.region}
                            </Typography>
                          </Box>
                        )}

                        {announcement.priceFrom && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MoneyIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              от {announcement.priceFrom} ₽
                            </Typography>
                          </Box>
                        )}

                        {announcement.estimatedDays && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {announcement.estimatedDays} дней
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ViewsIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {announcement.views} просмотров
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                      <Tooltip title="Редактировать">
                        <IconButton
                          color="primary"
                          onClick={(event: MouseEvent) => {
                            event.stopPropagation()
                            navigate(`/announcements/${announcement.id}/edit`)
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={announcement.isHidden ? 'Показать' : 'Скрыть'}>
                        <IconButton
                          color={announcement.isHidden ? 'success' : 'warning'}
                          onClick={(event: MouseEvent) => {
                            event.stopPropagation()
                            handleToggleVisibility(announcement.id, announcement.isHidden)
                          }}
                        >
                          {announcement.isHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Удалить">
                        <IconButton
                          color="error"
                          onClick={(event: MouseEvent) => {
                            event.stopPropagation()
                            handleDelete(announcement.id)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  )
}
