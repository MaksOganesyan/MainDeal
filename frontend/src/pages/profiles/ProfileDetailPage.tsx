import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Avatar,
  Rating,
  Paper,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Language as WebIcon,
  Build as BuildIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfilesService } from '@/services/profiles.service';
import { IProfile } from '@/types/detail-deal.types';

const ProfileDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getUploadsUrl = () => {
    return import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://dd.ilyacode.ru'
      : 'http://localhost:4200';
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await ProfilesService.getProfile(Number(id));
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Профиль не найден'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/profiles')} sx={{ mt: 2 }}>
          Назад к списку
        </Button>
      </Container>
    );
  }

  const uploadsUrl = getUploadsUrl();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/profiles')}
        sx={{ mb: 3 }}
      >
        Назад к списку
      </Button>

      {/* Header Card */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="start" gap={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {profile.user?.fullName?.charAt(0) || profile.user?.login?.charAt(0) || 'U'}
            </Avatar>
            
            <Box flexGrow={1}>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {profile.companyName || profile.user?.fullName || profile.user?.login}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box display="flex" alignItems="center">
                  <Rating value={profile.rating} precision={0.1} readOnly />
                  <Typography variant="body1" color="text.secondary" ml={1}>
                    {profile.rating.toFixed(1)} ({profile.totalReviews} отзывов)
                  </Typography>
                </Box>
                <Chip
                  icon={<WorkIcon />}
                  label={`${profile.completedDeals} заказов`}
                  color="success"
                />
              </Box>

              {profile.experience && (
                <Typography variant="body1" color="text.secondary" mb={1}>
                  <WorkIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  Опыт работы: {profile.experience} лет
                </Typography>
              )}

              {profile.website && (
                <Typography variant="body1" color="primary" component="a" href={profile.website} target="_blank" sx={{ display: 'block', mb: 1 }}>
                  <WebIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  {profile.website}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          {profile.description && (
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                О компании
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {profile.description}
              </Typography>
            </Paper>
          )}

          {/* Portfolio */}
          {profile.portfolio && profile.portfolio.length > 0 && (
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                <ImageIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                Портфолио ({profile.portfolio.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {profile.portfolio.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {item.title}
                        </Typography>
                        {item.description && (
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {item.description}
                          </Typography>
                        )}
                        {item.category && (
                          <Chip label={item.category} size="small" sx={{ mr: 1 }} />
                        )}
                        {item.materials && item.materials.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Материалы: {item.materials.join(', ')}
                            </Typography>
                          </Box>
                        )}
                        {item.images && item.images.length > 0 && (
                          <Grid container spacing={1} sx={{ mt: 2 }}>
                            {item.images.map((img, idx) => (
                              <Grid item xs={6} sm={4} key={idx}>
                                <Box
                                  component="img"
                                  src={`${uploadsUrl}${img}`}
                                  alt={`${item.title} ${idx + 1}`}
                                  sx={{
                                    width: '100%',
                                    height: 150,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => window.open(`${uploadsUrl}${img}`, '_blank')}
                                  onError={(e: any) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Specializations */}
          {profile.specializations && profile.specializations.length > 0 && (
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Специализации
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {profile.specializations.map((spec, index) => (
                  <Chip key={index} label={spec} color="primary" />
                ))}
              </Box>
            </Paper>
          )}

          {/* Equipment */}
          {profile.equipment && profile.equipment.length > 0 && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                <BuildIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                Оборудование ({profile.equipment.length})
              </Typography>
              <Box sx={{ mt: 2 }}>
                {profile.equipment.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.type}
                      {item.model && ` • ${item.model}`}
                      {item.year && ` • ${item.year} г.`}
                    </Typography>
                    {item.description && (
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                    {item.images && item.images.length > 0 && (
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        {item.images.map((img, idx) => (
                          <Grid item xs={6} key={idx}>
                            <Box
                              component="img"
                              src={`${uploadsUrl}${img}`}
                              alt={`${item.name} ${idx + 1}`}
                              sx={{
                                width: '100%',
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                cursor: 'pointer',
                              }}
                              onClick={() => window.open(`${uploadsUrl}${img}`, '_blank')}
                              onError={(e: any) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileDetailPage;

