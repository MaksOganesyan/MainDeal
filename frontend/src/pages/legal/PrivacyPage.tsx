import { Box, Container, Paper, Typography } from '@mui/material'
import './LegalPages.css'

export default function PrivacyPage() {
  return (
    <Box className="legal-page">
      <Container maxWidth="md">
        <Paper className="legal-page__paper" elevation={1}>
          <Typography variant="h4" component="h1" className="legal-page__title">
            Политика конфиденциальности
          </Typography>
          <Typography variant="subtitle2" className="legal-page__date">
            Последнее обновление: 11 мая 2026 г.
          </Typography>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              1. Общие положения
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              2. Сбор и использование персональных данных
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              3. Хранение и защита данных
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              4. Передача данных третьим лицам
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              5. Права пользователей
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              6. Изменения в политике
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              7. Контактная информация
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
