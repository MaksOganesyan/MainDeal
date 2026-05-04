import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { announcementsService } from '@/services/announcements.service'
import { ImageUpload } from '@/components/ImageUpload/ImageUpload'

const categories = [
  'Токарные работы',
  'Фрезерные работы',
  'Сварочные работы',
  'Слесарные работы',
  'Монтажные работы',
  'Проектирование',
  'Консультации',
  'Другое',
]

export default function CreateAnnouncementPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priceFrom: '',
    priceTo: '',
    currency: 'RUB',
    estimatedDays: '',
    region: '',
    location: '',
    isUrgent: false,
    images: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const dto = {
        ...formData,
        priceFrom: formData.priceFrom ? Number(formData.priceFrom) : undefined,
        priceTo: formData.priceTo ? Number(formData.priceTo) : undefined,
        estimatedDays: formData.estimatedDays ? Number(formData.estimatedDays) : undefined,
        images: formData.images
      }

      await announcementsService.create(dto)
      alert('Объявление успешно создано!')
      navigate('/announcements/my')
    } catch (error: any) {
      console.error('Failed to create announcement:', error)
      setError(error.response?.data?.message || 'Ошибка при создании объявления')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Создать объявление
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Опишите услугу, которую вы готовы предоставить
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Название */}
            <TextField
              label="Название услуги"
              name="title"
              required
              fullWidth
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: Токарные работы по металлу"
            />

            {/* Описание */}
            <TextField
              label="Описание"
              name="description"
              required
              fullWidth
              multiline
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Подробно опишите услугу, возможности, опыт работы..."
            />

            {/* Категория */}
            <TextField
              label="Категория работ"
              name="category"
              required
              fullWidth
              select
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Цены */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Цена от (₽)"
                  name="priceFrom"
                  type="number"
                  fullWidth
                  value={formData.priceFrom}
                  onChange={handleChange}
                  placeholder="1000"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Цена до (₽)"
                  name="priceTo"
                  type="number"
                  fullWidth
                  value={formData.priceTo}
                  onChange={handleChange}
                  placeholder="10000"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            {/* Срок выполнения */}
            <TextField
              label="Ориентировочный срок выполнения (дней)"
              name="estimatedDays"
              type="number"
              fullWidth
              value={formData.estimatedDays}
              onChange={handleChange}
              placeholder="5"
              inputProps={{ min: 1 }}
            />

            {/* Регион и местоположение */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Регион"
                  name="region"
                  fullWidth
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Москва"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Местоположение"
                  name="location"
                  fullWidth
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Москва, ул. Ленина"
                />
              </Grid>
            </Grid>

            {/* Изображения */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Изображения услуг
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Добавьте фотографии выполненных работ или вашего оборудования
              </Typography>
              <ImageUpload
                endpoint="announcement"
                multiple={true}
                maxFiles={10}
                onUploadSuccess={(urls) => {
                  setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...urls],
                  }));
                }}
                existingImages={formData.images}
                onRemoveImage={(url) => {
                  setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter(img => img !== url),
                  }));
                }}
              />
            </Box>

            {/* Срочное */}
            <FormControlLabel
              control={
                <Checkbox
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                />
              }
              label="Отметить как срочное (будет выше в поиске)"
            />

            {/* Кнопки */}
            <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                fullWidth
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Создание...' : 'Создать объявление'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}
