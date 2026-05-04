import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Avatar,
  Rating,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProfilesService } from '@/services/profiles.service';
import { IProfile } from '@/types/detail-deal.types';

const ProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecialization, setSearchSpecialization] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await ProfilesService.getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await ProfilesService.getProfiles(searchSpecialization);
      setProfiles(data);
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchSpecialization('');
    loadProfiles();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Исполнители металлообработки
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Найдите профессионалов для выполнения ваших заказов
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Поиск по специализации..."
            value={searchSpecialization}
            onChange={(e) => setSearchSpecialization(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1, minWidth: '250px' }}
            size="medium"
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            size="large"
          >
            Поиск
          </Button>
          {searchSpecialization && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearSearch}
              size="large"
            >
              Очистить
            </Button>
          )}
        </Box>
      </Box>

      {profiles.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            {searchSpecialization
              ? `Не найдено исполнителей по специализации "${searchSpecialization}"`
              : 'Исполнители не найдены'}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3
          }}
        >
          {profiles.map((profile) => (
            <Box key={profile.id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem',
                        mr: 2,
                      }}
                    >
                      {profile.user?.fullName?.charAt(0) || profile.user?.login?.charAt(0) || 'U'}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {profile.companyName || profile.user?.fullName || profile.user?.login}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.user?.login}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating value={profile.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {profile.rating.toFixed(1)} ({profile.totalReviews})
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Выполнено: {profile.completedDeals} заказов
                  </Typography>

                  {profile.experience && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Опыт: {profile.experience} лет
                    </Typography>
                  )}

                  {profile.specializations.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="body2" fontWeight={500} mb={1}>
                        Специализации:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {profile.specializations.slice(0, 3).map((spec, index) => (
                          <Chip key={index} label={spec} size="small" color="primary" variant="outlined" />
                        ))}
                        {profile.specializations.length > 3 && (
                          <Chip label={`+${profile.specializations.length - 3}`} size="small" />
                        )}
                      </Box>
                    </Box>
                  )}

                  {profile.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {profile.description}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent="space-between" mt={2} pt={2} borderTop={1} borderColor="divider">
                    <Typography variant="caption" color="text.secondary">
                      Оборудование: {profile.equipment?.length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Портфолио: {profile.portfolio?.length || 0}
                    </Typography>
                  </Box>
                </CardContent>
                <Box p={2} pt={0}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => navigate(`/profiles/${profile.id}`)}
                  >
                    Посмотреть профиль
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ProfilesPage;