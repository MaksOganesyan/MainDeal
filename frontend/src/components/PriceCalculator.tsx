import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton
} from '@mui/material'
import {
  Calculate as CalculateIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { DealsService, PriceCalculation } from '@/services/deals.service'

const categories = [
  'Металлообработка',
  'Деревообработка',
  'Электромонтаж',
  'Сварочные работы',
  'Токарные работы',
  'Фрезерные работы',
  'Штамповка',
  'Гибка металла'
]

const commonMaterials = [
  'Сталь',
  'Алюминий',
  'Медь',
  'Пластик',
  'Дерево',
  'Нержавеющая сталь'
]

export default function PriceCalculator() {
  const [category, setCategory] = useState('')
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium')
  const [materials, setMaterials] = useState<string[]>([])
  const [estimatedTime, setEstimatedTime] = useState<number | ''>('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [location, setLocation] = useState('')
  const [calculating, setCalculating] = useState(false)
  const [result, setResult] = useState<PriceCalculation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    if (!category) {
      setError('Выберите категорию работ')
      return
    }

    try {
      setCalculating(true)
      setError(null)
      
      const data = await DealsService.calculatePrice({
        category,
        complexity,
        materials: materials.length > 0 ? materials : undefined,
        estimatedTime: estimatedTime ? Number(estimatedTime) : undefined,
        isUrgent,
        location: location || undefined
      })
      
      setResult(data)
    } catch (error: any) {
      console.error('Failed to calculate price:', error)
      setError('Не удалось рассчитать стоимость')
    } finally {
      setCalculating(false)
    }
  }

  const handleToggleMaterial = (material: string) => {
    setMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getComplexityText = (c: string) => {
    switch (c) {
      case 'low': return 'Низкая'
      case 'medium': return 'Средняя'
      case 'high': return 'Высокая'
      default: return c
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CalculateIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Калькулятор стоимости заказа
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Inputs */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Категория работ *</InputLabel>
            <Select
              value={category}
              label="Категория работ *"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Сложность</InputLabel>
            <Select
              value={complexity}
              label="Сложность"
              onChange={(e) => setComplexity(e.target.value as any)}
            >
              <MenuItem value="low">Низкая</MenuItem>
              <MenuItem value="medium">Средняя</MenuItem>
              <MenuItem value="high">Высокая</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Срок выполнения (дни)"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value ? Number(e.target.value) : '')}
            helperText="Влияет на итоговую цену"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Местоположение"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            helperText="Опционально"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
            }
            label="Срочный заказ (+50% к цене)"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Материалы (выберите нужные):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {commonMaterials.map(material => (
              <Chip
                key={material}
                label={material}
                onClick={() => handleToggleMaterial(material)}
                color={materials.includes(material) ? 'primary' : 'default'}
                variant={materials.includes(material) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Каждый материал добавляет ~20% к стоимости
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCalculate}
            disabled={calculating || !category}
            startIcon={calculating ? <CircularProgress size={20} /> : <CalculateIcon />}
          >
            {calculating ? 'Рассчитываем...' : 'Рассчитать стоимость'}
          </Button>
        </Grid>

        {/* Results */}
        {result && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Рекомендованная цена
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {formatCurrency(result.estimatedPrice)}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption">Минимум</Typography>
                      <Typography variant="h6">{formatCurrency(result.minPrice)}</Typography>
                    </Box>
                    <Typography variant="h6">—</Typography>
                    <Box>
                      <Typography variant="caption">Максимум</Typography>
                      <Typography variant="h6">{formatCurrency(result.maxPrice)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Базовая цена категории
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(result.breakdown.basePrice)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Средняя рыночная цена
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(result.marketAverage)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    На основе {result.breakdown.samplesCount} завершенных заказов
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Детали расчета
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Коэффициент сложности:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {getComplexityText(complexity)} (×{result.breakdown.complexityMultiplier})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Количество материалов:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {result.breakdown.materialsCount}
                      </Typography>
                    </Grid>
                    {result.breakdown.estimatedTime && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Срок выполнения:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {result.breakdown.estimatedTime} дней
                        </Typography>
                      </Grid>
                    )}
                    {result.breakdown.isUrgent && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Срочность:
                        </Typography>
                        <Chip label="+50%" color="warning" size="small" />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="body2">
                  <strong>Обратите внимание:</strong> Расчет является ориентировочным и основан на средних рыночных ценах. 
                  Финальная стоимость может отличаться в зависимости от специфики вашего заказа и условий исполнителя.
                </Typography>
              </Alert>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  )
}

