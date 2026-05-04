import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'
import { ChatService } from '@/services/chat.service'

export default function NewChatPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dealId = searchParams.get('dealId')
  const announcementId = searchParams.get('announcementId')

  useEffect(() => {
    createChat()
  }, [dealId, announcementId])

  const createChat = async () => {
    try {
      setLoading(true)
      setError(null)

      if (dealId) {
        // Try to get existing room for deal
        try {
          const existingRoom = await ChatService.getRoomByDealId(Number(dealId))
          navigate(`/chats/${existingRoom.id}`, { replace: true })
          return
        } catch (err: any) {
          // If 404, create new room. If 403, user doesn't have access
          if (err.response?.status === 404 || err.response?.status === 403) {
            // Try to create new room
            try {
              const newRoom = await ChatService.createRoom(Number(dealId), {
                memberIds: [] // Backend will handle member assignment
              })
              navigate(`/chats/${newRoom.id}`, { replace: true })
              return
            } catch (createErr: any) {
              // If room already exists after creation attempt, try to get it again
              if (createErr.response?.data?.message?.includes('already exists')) {
                const room = await ChatService.getRoomByDealId(Number(dealId))
                navigate(`/chats/${room.id}`, { replace: true })
                return
              }
              throw createErr
            }
          }
          throw err
        }
      }

      if (announcementId) {
        // Create room for announcement - use POST to /chat/rooms/announcement/:id
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4200/api'}/chat/rooms/announcement/${announcementId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create chat room')
        }

        const newRoom = await response.json()
        navigate(`/chats/${newRoom.id}`, { replace: true })
        return
      }

      setError('Не указан заказ или объявление')
    } catch (error: any) {
      console.error('Failed to create chat:', error)
      setError(error.message || 'Не удалось создать чат')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">
            Создание чата...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Подключаем менеджера и настраиваем комнату
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer', textAlign: 'center' }}
          onClick={() => navigate(-1)}
        >
          ← Вернуться назад
        </Typography>
      </Container>
    )
  }

  return null
}

