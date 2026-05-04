// NOTE: UI-only mock. Backend integration (React Query + service) will be added later.

import { memo, useMemo, useState } from 'react'
import { Avatar, Box, ButtonBase, InputBase, Menu, MenuItem, Stack, Typography } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

type SortMode = 'newest' | 'oldest' | 'unread'

type ChatPreview = {
  id: string
  customerName: string
  managerName: string
  orderTitle: string
  managerStatus: string
  lastMessageAt: string // ISO
  unread: boolean
  customerAvatarUrl?: string
  managerAvatarUrl?: string
}

const MOCK_CHATS: ChatPreview[] = [
  {
    id: '1',
    customerName: 'Александр',
    managerName: 'Евгений',
    orderTitle: 'Лазерная резка по металлу',
    managerStatus: 'Пока не назначен',
    lastMessageAt: '2025-11-25T12:10:00.000Z',
    unread: true
  },
  {
    id: '2',
    customerName: 'Александр',
    managerName: 'Евгений',
    orderTitle: 'Лазерная резка по металлу',
    managerStatus: 'Пока не назначен',
    lastMessageAt: '2025-11-25T10:40:00.000Z',
    unread: true
  },
  {
    id: '3',
    customerName: 'Александр',
    managerName: 'Евгений',
    orderTitle: 'Лазерная резка по металлу',
    managerStatus: 'Пока не назначен',
    lastMessageAt: '2025-11-25T09:15:00.000Z',
    unread: true
  }
]

function formatShortRu(iso: string) {
  try {
    return format(new Date(iso), 'd MMM', { locale: ru })
  } catch {
    return ''
  }
}

const ChevronV = memo(function ChevronV() {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderLeft: '2px solid rgba(255,255,255,0.9)',
        borderBottom: '2px solid rgba(255,255,255,0.9)',
        transform: 'rotate(-45deg)',
        mt: '-2px'
      }}
    />
  )
})

const ChatRow = memo(function ChatRow({ chat }: { chat: ChatPreview }) {
  return (
    <Box
      sx={{
        bgcolor: 'var(--dd-row)',
        px: 2.25,
        py: 1.6,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '160px 160px 1fr',
          columnGap: 4,
          alignItems: 'start',
          pr: 10
        }}
      >
        {/* Заказчик */}
        <Box>
          <Typography sx={{ fontSize: 12, color: 'var(--dd-muted2)', mb: 0.6 }}>
            Заказчик:
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={chat.customerAvatarUrl}
              sx={{ width: 28, height: 28, bgcolor: '#555', fontSize: 12 }}
            />
            <Typography sx={{ fontSize: 14, color: 'var(--dd-text)' }}>
              {chat.customerName}
            </Typography>
          </Stack>
        </Box>

        {/* Менеджер */}
        <Box>
          <Typography sx={{ fontSize: 12, color: 'var(--dd-muted2)', mb: 0.6 }}>
            Менеджер:
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={chat.managerAvatarUrl}
              sx={{
                width: 28,
                height: 28,
                bgcolor: '#5A6A74',
                fontSize: 12,
                color: 'rgba(255,255,255,0.95)'
              }}
            >
              {chat.managerName?.[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: 14, color: 'var(--dd-text)' }}>
              {chat.managerName}
            </Typography>
          </Stack>
        </Box>

        <Box />
      </Box>

      <Box sx={{ mt: 1.1, pr: 10 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'var(--dd-chip)',
            borderRadius: 999,
            height: 26,
            px: 1.4
          }}
        >
          <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
            {`Заказ: ${chat.orderTitle}`}
          </Typography>
        </Box>

        <Typography sx={{ mt: 0.8, fontSize: 12, color: 'var(--dd-muted2)' }}>
          {`Менеджер: ${chat.managerStatus}`}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 18,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1.6,
          pointerEvents: 'none'
        }}
      >
        {chat.unread && (
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'var(--dd-accent)'
            }}
          />
        )}
        <Typography sx={{ fontSize: 12, color: 'var(--dd-muted2)' }}>
          {formatShortRu(chat.lastMessageAt)}
        </Typography>
      </Box>
    </Box>
  )
})

export default function ChatManagement() {
  const [sort, setSort] = useState<SortMode>('newest')
  const [query, setQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()

    let list = MOCK_CHATS.filter(x => {
      if (!q) return true
      return (
        x.customerName.toLowerCase().includes(q) ||
        x.managerName.toLowerCase().includes(q) ||
        x.orderTitle.toLowerCase().includes(q)
      )
    })

    if (sort === 'unread') list = list.filter(x => x.unread)

    list.sort((a, b) => {
      const da = +new Date(a.lastMessageAt)
      const db = +new Date(b.lastMessageAt)
      return sort === 'oldest' ? da - db : db - da
    })

    return list
  }, [query, sort])

  return (
    <Box
      sx={{
        '--dd-page': '#2B2B2B',
        '--dd-panel': '#3B3B3B',
        '--dd-row': '#2B2B2B',
        '--dd-chip': '#3B3B3B',
        '--dd-accent': '#69ABD5',
        '--dd-text': 'rgba(255,255,255,0.92)',
        '--dd-muted2': 'rgba(255,255,255,0.28)',
        '--dd-searchBg': '#EBE6EF',

        bgcolor: 'var(--dd-page)',
        minHeight: '100%',
        pb: 4
      }}
    >
      <Box sx={{ px: { xs: 2, md: 8 }, pt: 2 }}>
        <Typography sx={{ fontSize: 11, color: 'var(--dd-muted2)', mb: 0.6 }}>
          ГЛАВНАЯ &nbsp; • &nbsp; ЧАТЫ
        </Typography>
        <Typography sx={{ fontSize: 42, fontWeight: 700, color: 'var(--dd-accent)', lineHeight: 1 }}>
          Чаты
        </Typography>
      </Box>

      <Box sx={{ mt: 2, bgcolor: 'var(--dd-panel)', px: { xs: 2, md: 8 }, py: 2.2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <ButtonBase
            onClick={e => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'rgba(255,255,255,0.95)',
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1,
              px: 0.2,
              py: 0.6
            }}
          >
            <span>Сортировка</span>
            <ChevronV />
          </ButtonBase>

          <Box sx={{ flex: 1, position: 'relative' }}>
            <Box
              sx={{
                height: 38,
                bgcolor: 'var(--dd-searchBg)',
                borderRadius: 999,
                pl: 2.4,
                pr: 6,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <InputBase
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск"
                sx={{ width: '100%', fontSize: 14, color: 'rgba(0,0,0,0.70)' }}
              />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(0,0,0,0.55)'
              }}
            >
              <SearchOutlinedIcon sx={{ fontSize: 30 }} />
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              bgcolor: '#2F2F2F',
              color: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(255,255,255,0.08)'
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setSort('newest')
              setAnchorEl(null)
            }}
          >
            Сначала новые
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSort('oldest')
              setAnchorEl(null)
            }}
          >
            Сначала старые
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSort('unread')
              setAnchorEl(null)
            }}
          >
            Непрочитанные
          </MenuItem>
        </Menu>

        <Box sx={{ mt: 2 }}>
          <Stack spacing={1.2}>
            {items.map(chat => (
              <ChatRow key={chat.id} chat={chat} />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}