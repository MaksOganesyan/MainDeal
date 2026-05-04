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
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { ChatService } from '@/services/chat.service'
import { useProfile } from '@/hooks/useProfile'

// Компонент для одного окна чата
function ChatWindow({ 
  title, 
  otherUser, 
  messages, 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  sending, 
  user, 
  messagesEndRef 
}: any) {
  const isMyMessage = (message: any) => {
    return message.authorId === user?.id
  }

  const getRoleName = (roles: string[]) => {
    if (roles?.includes('MANAGER')) return 'Менеджер'
    if (roles?.includes('EXECUTOR')) return 'Исполнитель'
    if (roles?.includes('CUSTOMER')) return 'Заказчик'
    return 'Пользователь'
  }

  const getRoleColor = (roles: string[]) => {
    if (roles?.includes('MANAGER')) return 'warning'
    if (roles?.includes('EXECUTOR')) return 'success'
    if (roles?.includes('CUSTOMER')) return 'info'
    return 'default'
  }

  const formatMessageTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: `${getRoleColor(otherUser?.roles)}.main`, width: 32, height: 32 }}>
            {(otherUser?.fullName || otherUser?.login)?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              {title}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              {otherUser?.fullName || otherUser?.login}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      <Box
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
              Нет сообщений
            </Typography>
          </Box>
        ) : (
          messages.map((message: any) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: isMyMessage(message) ? 'flex-end' : 'flex-start',
                mb: 1.5
              }}
            >
              {!isMyMessage(message) && (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    mr: 1,
                    bgcolor: `${getRoleColor(message.author?.roles)}.main`,
                    fontSize: '0.875rem'
                  }}
                >
                  {(message.author?.fullName || message.author?.login)?.[0]?.toUpperCase()}
                </Avatar>
              )}
              
              <Box
                sx={{
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMyMessage(message) ? 'flex-end' : 'flex-start'
                }}
              >
                {!isMyMessage(message) && (
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', px: 1, mb: 0.3 }}>
                    <Typography variant="caption" fontWeight="600" fontSize="0.7rem">
                      {message.author?.fullName || message.author?.login}
                    </Typography>
                    <Chip
                      label={getRoleName(message.author?.roles)}
                      size="small"
                      color={getRoleColor(message.author?.roles) as any}
                      sx={{ height: 16, fontSize: '0.6rem', '& .MuiChip-label': { px: 0.75 } }}
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
                    borderTopRightRadius: isMyMessage(message) ? 0 : 2
                  }}
                >
                  <Typography variant="body2" fontSize="0.875rem" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                </Paper>
                
                <Typography variant="caption" color="text.secondary" fontSize="0.65rem" sx={{ px: 1, mt: 0.3 }}>
                  {formatMessageTime(message.createdAt)}
                </Typography>
              </Box>

              {isMyMessage(message) && (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    ml: 1,
                    bgcolor: 'warning.main',
                    fontSize: '0.875rem'
                  }}
                >
                  М
                </Avatar>
              )}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <form onSubmit={onSendMessage}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              multiline
              maxRows={2}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!newMessage.trim() || sending}
              size="small"
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Paper>
  )
}

export default function ManagerChatRoomPage() {
  const { id } = useParams<{ id: string }>()
  const [room, setRoom] = useState<any>(null)
  const [allMessages, setAllMessages] = useState<any[]>([])
  const [executorMessages, setExecutorMessages] = useState<any[]>([])
  const [customerMessages, setCustomerMessages] = useState<any[]>([])
  const [executorNewMessage, setExecutorNewMessage] = useState('')
  const [customerNewMessage, setCustomerNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingToExecutor, setSendingToExecutor] = useState(false)
  const [sendingToCustomer, setSendingToCustomer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const executorMessagesEndRef = useRef<HTMLDivElement>(null)
  const customerMessagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user } = useProfile()

  const [executor, setExecutor] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    if (id) {
      loadRoom()
      loadMessages()
    }
  }, [id])

  useEffect(() => {
    if (allMessages.length > 0 && executor && customer) {
      filterMessages()
    }
  }, [allMessages, executor, customer])

  const loadRoom = async () => {
    try {
      const data = await ChatService.getRoomById(Number(id))
      setRoom(data)
      
      // Определяем исполнителя и заказчика
      const exec = data.members?.find((m: any) => m.roles?.includes('EXECUTOR'))
      const cust = data.members?.find((m: any) => m.roles?.includes('CUSTOMER'))
      
      if ((data as any).deal) {
        // Если есть заказ, заказчик - владелец заказа
        const dealCustomer = data.members?.find((m: any) => m.id === (data as any).deal.customerId)
        if (dealCustomer) setCustomer(dealCustomer)
        // Исполнитель - не заказчик и не менеджер
        const dealExecutor = data.members?.find((m: any) => 
          m.id !== (data as any).deal.customerId && !m.roles?.includes('MANAGER')
        )
        if (dealExecutor) setExecutor(dealExecutor)
      } else if ((data as any).announcement) {
        // Если есть объявление, исполнитель - владелец объявления
        const annExecutor = data.members?.find((m: any) => m.id === (data as any).announcement.executorId)
        if (annExecutor) setExecutor(annExecutor)
        // Заказчик - не исполнитель и не менеджер
        const annCustomer = data.members?.find((m: any) => 
          m.id !== (data as any).announcement.executorId && !m.roles?.includes('MANAGER')
        )
        if (annCustomer) setCustomer(annCustomer)
      } else {
        // Fallback: определяем по ролям
        if (exec) setExecutor(exec)
        if (cust) setCustomer(cust)
      }
    } catch (error) {
      console.error('Failed to load room:', error)
      setError('Не удалось загрузить чат')
    }
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await ChatService.getMessages(Number(id))
      setAllMessages(data.reverse())
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMessages = () => {
    if (!executor || !customer) return

    // Фильтруем сообщения для исполнителя:
    // - Сообщения от исполнителя (authorId === executor.id)
    // - Сообщения от менеджера к исполнителю (recipientId === executor.id)
    // - Системные сообщения (AUTO_REPLY, без recipientId)
    const execMessages = allMessages.filter((msg: any) => 
      msg.authorId === executor.id || 
      msg.recipientId === executor.id ||
      (msg.type === 'AUTO_REPLY' && !msg.recipientId)
    )

    // Фильтруем сообщения для заказчика:
    // - Сообщения от заказчика (authorId === customer.id)
    // - Сообщения от менеджера к заказчику (recipientId === customer.id)
    // - Системные сообщения (AUTO_REPLY, без recipientId)
    const custMessages = allMessages.filter((msg: any) => 
      msg.authorId === customer.id || 
      msg.recipientId === customer.id ||
      (msg.type === 'AUTO_REPLY' && !msg.recipientId)
    )

    setExecutorMessages(execMessages)
    setCustomerMessages(custMessages)
  }

  const handleSendToExecutor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!executorNewMessage.trim() || sendingToExecutor || !executor) return

    try {
      setSendingToExecutor(true)
      setError(null)
      const message = await ChatService.createMessage(Number(id), {
        content: executorNewMessage.trim(),
        recipientId: executor.id  // Указываем что сообщение адресовано исполнителю
      })
      setAllMessages([...allMessages, message])
      setExecutorNewMessage('')
    } catch (error: any) {
      console.error('Failed to send message:', error)
      setError(error.response?.data?.message || 'Не удалось отправить сообщение')
    } finally {
      setSendingToExecutor(false)
    }
  }

  const handleSendToCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerNewMessage.trim() || sendingToCustomer || !customer) return

    try {
      setSendingToCustomer(true)
      setError(null)
      const message = await ChatService.createMessage(Number(id), {
        content: customerNewMessage.trim(),
        recipientId: customer.id  // Указываем что сообщение адресовано заказчику
      })
      setAllMessages([...allMessages, message])
      setCustomerNewMessage('')
    } catch (error: any) {
      console.error('Failed to send message:', error)
      setError(error.response?.data?.message || 'Не удалось отправить сообщение')
    } finally {
      setSendingToCustomer(false)
    }
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Чат не найден</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, height: 'calc(100vh - 80px)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/manager/chats')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Управление чатом
          </Typography>
          {(room as any).deal && (
            <Chip
              label={`Заказ: ${(room as any).deal.title}`}
              color="primary"
              onClick={() => navigate(`/deals/${(room as any).deal.id}`)}
            />
          )}
          {(room as any).announcement && (
            <Chip
              label={`Объявление: ${(room as any).announcement.title}`}
              color="secondary"
              onClick={() => navigate(`/announcements/${(room as any).announcement.id}`)}
            />
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Two Chat Windows Side by Side */}
        <Box sx={{ display: 'flex', gap: 2, flex: 1, height: 0 }}>
          <Box sx={{ flex: 1, height: '100%' }}>
            <ChatWindow
              title="Чат с исполнителем"
              otherUser={executor}
              messages={executorMessages}
              newMessage={executorNewMessage}
              setNewMessage={setExecutorNewMessage}
              onSendMessage={handleSendToExecutor}
              sending={sendingToExecutor}
              user={user}
              messagesEndRef={executorMessagesEndRef}
            />
          </Box>
          
          <Box sx={{ flex: 1, height: '100%' }}>
            <ChatWindow
              title="Чат с заказчиком"
              otherUser={customer}
              messages={customerMessages}
              newMessage={customerNewMessage}
              setNewMessage={setCustomerNewMessage}
              onSendMessage={handleSendToCustomer}
              sending={sendingToCustomer}
              user={user}
              messagesEndRef={customerMessagesEndRef}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

