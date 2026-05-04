import { Container, Typography, Box } from '@mui/material'
import PriceCalculator from '@/components/PriceCalculator'

export default function PriceCalculatorPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Калькулятор стоимости
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Рассчитайте примерную стоимость вашего заказа на основе параметров и рыночных цен
        </Typography>
      </Box>
      <PriceCalculator />
    </Container>
  )
}

