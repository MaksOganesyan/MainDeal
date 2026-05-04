import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Badge
} from '@mui/material'
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { ChatService } from '@/services/chat.service'
import { useProfile } from '@/hooks/useProfile'

export default function ChatsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useProfile()

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      setLoading(true)
      const data = await ChatService.getRooms()
      setRooms(data)
    } catch (error) {
      console.error('Failed to load chat rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherMember = (room: any) => {
    // Показываем менеджера как собеседника
    const members = room.members || []
    return members.find((m: any) => m.id !== user?.id && m.roles?.includes('MANAGER'))
  }

  const getLastMessage = (room: any) => {
    const messages = room.messages || []
    return messages[0] // Assuming messages are sorted by date desc
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Вчера'
    } else {
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Мои чаты
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Все коммуникации проходят через менеджера для обеспечения безопасности
        </Typography>
      </Box>

      {rooms.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас пока нет чатов
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Чаты создаются автоматически при взаимодействии с заказами и объявлениями
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List sx={{ p: 0 }}>
            {rooms.map((room, index) => {
              const otherMember = getOtherMember(room)
              const lastMessage = getLastMessage(room)
              const hasUnread = room.unreadCount > 0

              return (
                <Box key={room.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate(`/chats/${room.id}`)}
                      sx={{
                        py: 2,
                        px: 3,
                        bgcolor: hasUnread ? 'action.hover' : 'transparent'
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={room.unreadCount || 0}
                          color="error"
                          overlap="circular"
                        >
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={hasUnread ? 'bold' : 'medium'}
                            >
                              {otherMember?.fullName || otherMember?.login || 'Участник'}
                            </Typography>
                            {room.isActive && (
                              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <span>
                            {room.deal && (
                              <Chip
                                label={room.deal.title}
                                size="small"
                                sx={{ mr: 1, mb: 0.5 }}
                              />
                            )}
                            {room.announcement && (
                              <Chip
                                label={room.announcement.title}
                                size="small"
                                color="secondary"
                                sx={{ mr: 1, mb: 0.5 }}
                              />
                            )}
                            {lastMessage && (
                              <span
                                style={{
                                  display: 'block',
                                  marginTop: '4px',
                                  fontWeight: hasUnread ? 'bold' : 'normal',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  color: 'rgba(0, 0, 0, 0.6)',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {lastMessage.content}
                              </span>
                            )}
                          </span>
                        }
                      />
                      
                      {lastMessage && (
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(lastMessage.createdAt)}
                        </Typography>
                      )}
                    </ListItemButton>
                  </ListItem>
                  {index < rooms.length - 1 && <Divider />}
                </Box>
              )
            })}
          </List>
        </Paper>
      )}
    </Container>
  )
}

