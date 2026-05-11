import { Box, Container, Paper, Typography } from '@mui/material'
import './LegalPages.css'

export default function TermsPage() {
  return (
    <Box className="legal-page">
      <Container maxWidth="md">
        <Paper className="legal-page__paper" elevation={1}>
          <Typography variant="h4" component="h1" className="legal-page__title">
            Правила сервиса
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
              2. Регистрация и учетная запись
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              3. Права и обязанности пользователей
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              4. Размещение заказов и исполнение работ
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              5. Оплата и комиссии
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              6. Ответственность сторон
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              7. Запрещенный контент и поведение
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              8. Прекращение действия соглашения
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              9. Контактная информация
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
