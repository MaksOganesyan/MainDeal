import { Box, Container, Paper, Typography } from '@mui/material'
import './LegalPages.css'

export default function OfferPage() {
  return (
    <Box className="legal-page">
      <Container maxWidth="md">
        <Paper className="legal-page__paper" elevation={1}>
          <Typography variant="h4" component="h1" className="legal-page__title">
            Договор-оферта на оказание платных услуг
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
              2. Предмет договора
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              3. Порядок оказания услуг
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              4. Стоимость и порядок оплаты
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              [Текст раздела будет добавлен позже]
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              5. Ответственность сторон
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
