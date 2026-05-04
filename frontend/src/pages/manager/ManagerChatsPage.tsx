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
  Badge,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'
import { ChatService } from '@/services/chat.service'
import { useProfile } from '@/hooks/useProfile'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`manager-chats-tabpanel-${index}`}
      aria-labelledby={`manager-chats-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ManagerChatsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [filteredRooms, setFilteredRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [assigningRoomId, setAssigningRoomId] = useState<number | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user } = useProfile()

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    filterRooms()
  }, [rooms, tabValue, searchQuery])

  const loadRooms = async () => {
    try {
      setLoading(true)
      // Используем специальный endpoint для менеджера, который возвращает ВСЕ чаты
      const data = await ChatService.getManagerRooms()
      setRooms(data)
    } catch (error) {
      console.error('Failed to load chat rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRooms = () => {
    let filtered = [...rooms]

    // Filter by tab
    if (tabValue === 1) {
      // My assigned chats
      filtered = filtered.filter(room => room.managerId === user?.id)
    } else if (tabValue === 2) {
      // Unassigned chats
      filtered = filtered.filter(room => !room.managerId)
    } else if (tabValue === 3) {
      // Closed chats
      filtered = filtered.filter(room => !room.isActive)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(room => {
        const dealTitle = room.deal?.title?.toLowerCase() || ''
        const announcementTitle = room.announcement?.title?.toLowerCase() || ''
        const memberNames = room.members?.map((m: any) => 
          (m.fullName || m.login || '').toLowerCase()
        ).join(' ') || ''
        
        const query = searchQuery.toLowerCase()
        return dealTitle.includes(query) || 
               announcementTitle.includes(query) || 
               memberNames.includes(query)
      })
    }

    setFilteredRooms(filtered)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleAssignToMe = async (roomId: number) => {
    try {
      setAssigningRoomId(roomId)
      await ChatService.assignManagerToRoom(roomId)
      // Reload rooms to reflect changes
      await loadRooms()
    } catch (error: any) {
      console.error('Failed to assign manager:', error)
      alert(error.response?.data?.message || 'Не удалось назначить менеджера')
    } finally {
      setAssigningRoomId(null)
    }
  }

  const getParticipants = (room: any) => {
    return room.members?.filter((m: any) => m.id !== user?.id) || []
  }

  const getLastMessage = (room: any) => {
    const messages = room.messages || []
    return messages[0]
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Управление чатами
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Модерация и поддержка общения между клиентами и исполнителями
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {rooms.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Всего чатов
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            {rooms.filter(r => r.managerId === user?.id).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Мои чаты
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="warning.main">
            {rooms.filter(r => !r.managerId).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Без менеджера
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="error.main">
            {rooms.filter(r => r.unreadCount > 0).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Требуют ответа
          </Typography>
        </Paper>
      </Box>

      {/* Search and Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Box sx={{ px: 3, pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск по заказам, участникам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2 }}>
          <Tab label={`Все (${rooms.length})`} />
          <Tab label={`Мои (${rooms.filter(r => r.managerId === user?.id).length})`} />
          <Tab label={`Без менеджера (${rooms.filter(r => !r.managerId).length})`} />
          <Tab label={`Закрытые (${rooms.filter(r => !r.isActive).length})`} />
        </Tabs>
      </Paper>

      {/* Chat List */}
      <TabPanel value={tabValue} index={tabValue}>
        {filteredRooms.length === 0 ? (
          <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery ? 'Чаты не найдены' : 'Нет чатов'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Чаты появятся когда пользователи начнут общение'}
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={2}>
            <List sx={{ p: 0 }}>
              {filteredRooms.map((room, index) => {
                const participants = getParticipants(room)
                const lastMessage = getLastMessage(room)
                const hasUnread = room.unreadCount > 0
                const isMyChat = room.managerId === user?.id

                return (
                  <Box key={room.id}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        !isMyChat && !room.managerId && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AssignmentIcon />}
                            disabled={assigningRoomId === room.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAssignToMe(room.id)
                            }}
                          >
                            {assigningRoomId === room.id ? 'Назначение...' : 'Взять'}
                          </Button>
                        )
                      }
                    >
                      <ListItemButton
                        onClick={() => navigate(`/manager/chats/${room.id}`)}
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
                            <Avatar sx={{ bgcolor: isMyChat ? 'success.main' : 'primary.main' }}>
                              <PersonIcon />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={hasUnread ? 'bold' : 'medium'}
                              >
                                {participants.map((p: any) => p.fullName || p.login).join(', ') || 'Участники'}
                              </Typography>
                              {room.isActive && (
                                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                              )}
                              {isMyChat && (
                                <Chip label="Мой" size="small" color="success" />
                              )}
                              {!room.managerId && (
                                <Chip label="Без менеджера" size="small" color="warning" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              {room.deal && (
                                <Chip
                                  label={`Заказ: ${room.deal.title}`}
                                  size="small"
                                  sx={{ mr: 1, mb: 0.5 }}
                                />
                              )}
                              {room.announcement && (
                                <Chip
                                  label={`Объявление: ${room.announcement.title}`}
                                  size="small"
                                  color="secondary"
                                  sx={{ mr: 1, mb: 0.5 }}
                                />
                              )}
                              {lastMessage && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: 0.5,
                                    fontWeight: hasUnread ? 'bold' : 'normal',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {lastMessage.author?.fullName || lastMessage.author?.login}: {lastMessage.content}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        
                        {lastMessage && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            {formatDate(lastMessage.createdAt)}
                          </Typography>
                        )}
                      </ListItemButton>
                    </ListItem>
                    {index < filteredRooms.length - 1 && <Divider />}
                  </Box>
                )
              })}
            </List>
          </Paper>
        )}
      </TabPanel>
    </Container>
  )
}

