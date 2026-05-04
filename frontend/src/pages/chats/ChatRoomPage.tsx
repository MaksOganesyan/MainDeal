import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { ChatService } from '@/services/chat.service'
import { useProfile } from '@/hooks/useProfile'

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>()
  const [room, setRoom] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user } = useProfile()

  useEffect(() => {
    if (id) {
      loadRoom()
      loadMessages()
    }
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadRoom = async () => {
    try {
      const data = await ChatService.getRoomById(Number(id))
      setRoom(data)
    } catch (error) {
      console.error('Failed to load room:', error)
      setError('Не удалось загрузить чат')
    }
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await ChatService.getMessages(Number(id))
      // Бэкенд уже фильтрует сообщения по получателю, больше не нужно фильтровать на клиенте
      setMessages(data.reverse()) // Reverse to show oldest first
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      setError(null)
      const message = await ChatService.createMessage(Number(id), {
        content: newMessage.trim()
      })
      setMessages([...messages, message])
      setNewMessage('')
    } catch (error: any) {
      console.error('Failed to send message:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Не удалось отправить сообщение')
      }
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getOtherMembers = () => {
    if (!room) return []
    // Показываем менеджера как собеседника
    if (room.manager) {
      return [room.manager]
    }
    // Fallback: ищем менеджера в members
    return room.members?.filter((m: any) => 
      m.id !== user?.id && m.roles?.includes('MANAGER')
    ) || []
  }

  const formatMessageTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const formatMessageDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return 'Сегодня'
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Вчера'
    } else {
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    }
  }

  const shouldShowDateDivider = (index: number) => {
    if (index === 0) return true
    const currentDate = new Date(messages[index].createdAt).toDateString()
    const previousDate = new Date(messages[index - 1].createdAt).toDateString()
    return currentDate !== previousDate
  }

  const isMyMessage = (message: any) => {
    return message.authorId === user?.id
  }

  const getRoleName = (roles: string[]) => {
    if (roles?.includes('MANAGER')) return 'Менеджер'
    if (roles?.includes('EXECUTOR')) return 'Исполнитель'
    if (roles?.includes('CUSTOMER')) return 'Заказчик'
    if (roles?.includes('ADMIN')) return 'Администратор'
    return 'Пользователь'
  }

  const getRoleColor = (roles: string[]) => {
    if (roles?.includes('MANAGER')) return 'warning'
    if (roles?.includes('EXECUTOR')) return 'success'
    if (roles?.includes('CUSTOMER')) return 'info'
    if (roles?.includes('ADMIN')) return 'error'
    return 'default'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!room) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Чат не найден</Alert>
      </Container>
    )
  }

  const otherMembers = getOtherMembers()

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 100px)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/chats')}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                {otherMembers.map((m: any) => m.fullName || m.login).join(', ')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                {room.deal && (
                  <Chip
                    label={`Заказ: ${room.deal.title}`}
                    size="small"
                    onClick={() => navigate(`/deals/${room.deal.id}`)}
                  />
                )}
                {room.announcement && (
                  <Chip
                    label={`Объявление: ${room.announcement.title}`}
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/announcements/${room.announcement.id}`)}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Warning */}
        <Alert severity="info" sx={{ mb: 2 }}>
          ℹ️ Вы общаетесь через менеджера. Все сообщения проверяются. Запрещено передавать личные контактные данные.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Messages */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'grey.50'
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Нет сообщений. Начните общение!
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => (
              <Box key={message.id}>
                {shouldShowDateDivider(index) && (
                  <Box sx={{ textAlign: 'center', my: 2 }}>
                    <Chip
                      label={formatMessageDate(message.createdAt)}
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Box>
                )}
                
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isMyMessage(message) ? 'flex-end' : 'flex-start',
                    mb: 1.5
                  }}
                >
                  {!isMyMessage(message) && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        bgcolor: `${getRoleColor(message.author?.roles)}.main`
                      }}
                    >
                      {(message.author?.fullName || message.author?.login)?.[0]?.toUpperCase()}
                    </Avatar>
                  )}
                  
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMyMessage(message) ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {!isMyMessage(message) && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', px: 1, mb: 0.5 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.primary">
                          {message.author?.fullName || message.author?.login}
                        </Typography>
                        <Chip
                          label={getRoleName(message.author?.roles)}
                          size="small"
                          color={getRoleColor(message.author?.roles) as any}
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      </Box>
                    )}
                    
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        bgcolor: isMyMessage(message) ? 'primary.main' : 'background.paper',
                        color: isMyMessage(message) ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        borderTopLeftRadius: isMyMessage(message) ? 2 : 0,
                        borderTopRightRadius: isMyMessage(message) ? 0 : 2,
                        ...(message.isBlocked && {
                          bgcolor: 'error.light',
                          color: 'error.contrastText'
                        })
                      }}
                    >
                      {message.type === 'AUTO_REPLY' && (
                        <Chip
                          label="🤖 Автоответ"
                          size="small"
                          color="default"
                          sx={{ mb: 1 }}
                        />
                      )}
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {message.content}
                      </Typography>
                      {message.isBlocked && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                          ⚠️ Заблокировано: {message.blockReason}
                        </Typography>
                      )}
                    </Paper>
                    
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', px: 1, mt: 0.5 }}>
                      {isMyMessage(message) && (
                        <Chip
                          label="Вы"
                          size="small"
                          color="primary"
                          sx={{ height: 16, fontSize: '0.6rem' }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {formatMessageTime(message.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {isMyMessage(message) && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        ml: 1,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {user?.login?.[0]?.toUpperCase()}
                  </Avatar>
                  )}
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Paper>

        {/* Input */}
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <form onSubmit={handleSendMessage}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending || !room.isActive}
                multiline
                maxRows={4}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!newMessage.trim() || sending || !room.isActive}
                sx={{ alignSelf: 'flex-end' }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

