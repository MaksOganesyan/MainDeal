import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Fab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  Paper,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material'
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { ChatService } from '@/services/chat.service'
import { useProfile } from '@/hooks/useProfile'
import { UserRole } from '@/services/auth/auth.types'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useProfile()

  // Load unread count periodically
  useEffect(() => {
    if (user?.isLoggedIn) {
      loadUnreadCount()
      const interval = setInterval(loadUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user?.isLoggedIn])

  // Load rooms when dialog opens
  useEffect(() => {
    if (open && !selectedRoom) {
      loadRooms()
    }
  }, [open])

  // Load messages when room is selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages()
    }
  }, [selectedRoom])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadUnreadCount = async () => {
    try {
      const count = await ChatService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const loadRooms = async () => {
    try {
      setLoading(true)
      // Если пользователь - менеджер, используем специальный endpoint
      const isManager = user?.roles?.includes(UserRole.MANAGER)
      const data = isManager 
        ? await ChatService.getManagerRooms() 
        : await ChatService.getRooms()
      setRooms(data)
    } catch (error) {
      console.error('Failed to load rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    if (!selectedRoom) return
    try {
      const data = await ChatService.getMessages(selectedRoom.id)
      // Фильтруем сообщения: показываем только свои и от менеджера
      const filteredMessages = data.filter((msg: any) => {
        const isMyMessage = msg.authorId === user?.id
        const isFromManager = msg.author?.roles?.includes('MANAGER')
        return isMyMessage || isFromManager
      })
      setMessages(filteredMessages.reverse())
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRoom || sending) return

    try {
      setSending(true)
      const message = await ChatService.createMessage(selectedRoom.id, {
        content: newMessage.trim()
      })
      setMessages([...messages, message])
      setNewMessage('')
      loadUnreadCount() // Refresh unread count
    } catch (error: any) {
      console.error('Failed to send message:', error)
      alert(error.response?.data?.message || 'Не удалось отправить сообщение')
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedRoom(null)
    setMessages([])
  }

  const handleBack = () => {
    setSelectedRoom(null)
    setMessages([])
    loadRooms()
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getOtherMembers = (room: any) => {
    // Показываем только менеджера как собеседника (для обычных пользователей)
    const isManager = user?.roles?.includes(UserRole.MANAGER)
    if (isManager) {
      // Для менеджера показываем всех кроме себя
      return room.members?.filter((m: any) => m.id !== user?.id) || []
    }
    // Для заказчика и исполнителя показываем только менеджера
    return room.members?.filter((m: any) => 
      m.id !== user?.id && m.roles?.includes(UserRole.MANAGER)
    ) || []
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const isMyMessage = (message: any) => {
    return message.authorId === user?.id
  }

  return (
    <>
      {/* Floating button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon />
        </Badge>
      </Fab>

      {/* Chat dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: 600,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedRoom && (
              <IconButton size="small" onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6">
              {selectedRoom 
                ? getOtherMembers(selectedRoom).map((m: any) => m.fullName || m.login).join(', ')
                : 'Мои чаты'
              }
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedRoom ? (
            /* Chat room view */
            <>
              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Нет сообщений
                    </Typography>
                  </Box>
                ) : (
                  messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isMyMessage(message) ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Box sx={{ maxWidth: '70%' }}>
                        {!isMyMessage(message) && (
                          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                            {message.author?.fullName || message.author?.login}
                          </Typography>
                        )}
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            bgcolor: isMyMessage(message) ? 'primary.main' : 'background.paper',
                            color: isMyMessage(message) ? 'primary.contrastText' : 'text.primary',
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {message.content}
                          </Typography>
                        </Paper>
                        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                          {formatTime(message.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <form onSubmit={handleSendMessage}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Введите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                      multiline
                      maxRows={3}
                    />
                    <IconButton
                      type="submit"
                      color="primary"
                      disabled={!newMessage.trim() || sending}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </form>
              </Box>
            </>
          ) : (
            /* Rooms list view */
            <Box sx={{ overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : rooms.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    У вас пока нет чатов
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {rooms.map((room, index) => {
                    const members = getOtherMembers(room)
                    const lastMessage = room.messages?.[0]
                    
                    return (
                      <Box key={room.id}>
                        <ListItemButton onClick={() => setSelectedRoom(room)} sx={{ py: 2 }}>
                          <ListItemAvatar>
                            <Badge badgeContent={room.unreadCount || 0} color="error">
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <PersonIcon />
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={members.map((m: any) => m.fullName || m.login).join(', ')}
                            secondary={
                              <Box>
                                {room.deal && (
                                  <Chip label={room.deal.title} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                                )}
                                {lastMessage && (
                                  <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                                    {lastMessage.content}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItemButton>
                        {index < rooms.length - 1 && <Divider />}
                      </Box>
                    )
                  })}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

