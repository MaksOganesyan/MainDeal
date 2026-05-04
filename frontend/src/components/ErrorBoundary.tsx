import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useRouteError, useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  console.error('Error caught by ErrorBoundary:', error);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Упс! Что-то пошло не так
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.
          </Typography>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'error.light',
                borderRadius: 1,
                fontFamily: 'monospace',
              }}
            >
              {error.message || 'Unknown error'}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/')}>
              На главную
            </Button>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Перезагрузить страницу
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}