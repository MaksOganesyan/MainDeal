import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dealsService } from '@/services/deals.service'
import { useProfile } from '@/hooks/useProfile'
import '../normalize.css'
import './DealPage.css'

type DealUser = {
  id?: number
  fullName?: string
  login?: string
  email?: string
  region?: string
  avatar?: string
  roles?: any[]
}

type DealDetail = {
  id: number
  title?: string
  description?: string
  category?: string
  status?: string
  budget?: number | string | null
  price?: number | string | null
  isUrgent?: boolean
  deadline?: string | null
  estimatedTime?: number | string | null
  location?: string | null
  materials?: any
  specifications?: string | null
  drawings?: any
  attachments?: any
  customerId?: number
  executorId?: number | null
  createdAt?: string
  customer?: DealUser
  executor?: DealUser | null
}

const hasRequiredRole = (user: any): boolean => {
  if (!user) return false
  if (user.isExecutor || user.isSupport || user.isAdmin) return true
  const roles = user.roles || []
  const roleStrings = roles.map((r: any) => String(r).toUpperCase().replace('USERROLE_', ''))
  return ['EXECUTOR', 'MANAGER', 'ADMIN'].some((r) => roleStrings.includes(r))
}

const normalizeImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const host = import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://dd.ilyacode.ru'
    : 'http://localhost:4200'
  return `${host}${path}`
}

export default function DealPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoading: profileLoading } = useProfile()

  const [deal, setDeal] = useState<DealDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadedDealId = useRef<string | null>(null)
  const hasAccessChecked = useRef(false)

  // Загрузка данных
  useEffect(() => {
    if (id && id === loadedDealId.current) return
    if (!id) { setError('ID заказа не указан'); setLoading(false); return }
    if (!user?.isLoggedIn || profileLoading) return

    const loadDealData = async () => {
      try {
        setLoading(true)
        const data = await dealsService.getOne(Number(id))
        setDeal(data)
        setError('')
        loadedDealId.current = id
      } catch (err: any) {
        console.error('Failed to load deal:', err)
        setError(err.response?.status === 404 ? 'Заказ не найден' : err.response?.data?.message || 'Ошибка при загрузке заказа')
      } finally {
        setLoading(false)
      }
    }
    loadDealData()
  }, [id, user?.isLoggedIn, profileLoading])

  // Проверка доступа
  useEffect(() => {
    if (profileLoading) return
    if (hasAccessChecked.current) return
    hasAccessChecked.current = true

    if (!user || !user.isLoggedIn) {
      navigate('/auth')
      return
    }
    if (!hasRequiredRole(user)) {
      setError('Доступ ограничен')
      return
    }
  }, [user, profileLoading, navigate])

  // Обновление данных после отклика
  const handleLoadDeal = useCallback(() => {
    loadedDealId.current = null
    setLoading(true)
    if (id) {
      dealsService.getOne(Number(id))
        .then(data => { setDeal(data); setError(''); loadedDealId.current = id })
        .catch((err: any) => setError(err.response?.data?.message || 'Ошибка'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleRespond = () => {
    alert('Функционал отклика будет подключён к API')
  }

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault()
    if (deal?.customer?.id) {
      navigate(`/chats/new?dealId=${id}&customerId=${deal.customer.id}`)
    }
  }

  if (loading || profileLoading) {
    return <section className="DealPage"><div className="DealPage__container">Загрузка...</div></section>
  }

  if (error && !deal) {
    return <section className="DealPage"><div className="DealPage__container">{error}</div></section>
  }

  if (!deal) return null

  const customer = deal.customer || {}
  const mainImage = normalizeImageUrl((deal.attachments as string[])?.[0] || (deal.drawings as string[])?.[0] || '')
  
  const formatPrice = (val: number | string | null | undefined) => {
    if (!val) return 'Не указана'
    const num = Number(val)
    return Number.isNaN(num) ? String(val) : `${num.toLocaleString('ru-RU')} ₽`
  }

  const formatDeadline = () => {
    if (deal.deadline) return new Date(deal.deadline).toLocaleDateString('ru-RU')
    if (deal.estimatedTime) return `До ${deal.estimatedTime} дней`
    return 'Не указан'
  }

  const materialsText = Array.isArray(deal.materials) 
    ? deal.materials.join('\n') 
    : (typeof deal.materials === 'string' ? deal.materials : '')

  const isCustomer = user?.id === deal.customerId
  const isAssignedExecutor = user?.id === deal.executorId
  const canRespond = hasRequiredRole(user) && !user?.isAdmin && !user?.isSupport && !isCustomer && !isAssignedExecutor && deal.status === 'ACTIVE'

  return (
    <section className="DealPage">
      <div className="DealPage__container">
        <div className="DealPage__content-left">
          <h2 className="deal__title">{deal.title || 'Без названия'}</h2>
          
          <div className="deal__images">
            <img src={mainImage} alt={deal.title || 'Изображение заказа'} />
          </div>

          <div className="deal__description">
            <h3 className="description__title">Категория</h3>
            <p className="description__text">{deal.category || 'Не указана'}</p>
          </div>

          <div className="deal__description">
            <h3 className="description__title">Описание заказа</h3>
            <p className="description__text">{deal.description || 'Описание отсутствует'}</p>
          </div>

          {materialsText && (
            <div className="deal__description">
              <h3 className="description__title">Материалы</h3>
              <p className="description__text">{materialsText}</p>
            </div>
          )}
        </div>

        <div className="DealPage__content-right">
          {deal.isUrgent && (
            <h3 className="important__text">Срочный заказ</h3>
          )}

          <div className="customer__card">
            <div className="card__block">
              <h3 className="card__title">Заказчик</h3>
              <div className="customer__info">
                <img 
                  src={customer.avatar || '/public/default_avatar.svg'} 
                  alt="Аватар заказчика" 
                  className="customer__icon" 
                />
                <div className="customer__info-description">
                  <p className="customer__name">{customer.fullName || customer.login || 'Заказчик'}</p>
                  <p className="customer__email">{customer.email || ''}</p>
                </div>
              </div>
            </div>

            <div className="card__block">
              <h3 className="card__title">Цена от</h3>
              <p className="card__text card__text-bigger">{formatPrice(deal.budget || deal.price)}</p>
            </div>

            <div className="card__block">
              <h3 className="card__title">Срок выполнения</h3>
              <p className="card__text card__text-bigger">{formatDeadline()}</p>
            </div>

            <div className="card__block">
              <h3 className="card__title">Местоположение</h3>
              <p className="card__text">{deal.location || deal.customer?.region || 'Не указано'}</p>
            </div>
          </div>

          {canRespond && (
            <button className="deal__button" onClick={handleRespond}>
              Откликнуться на заказ
            </button>
          )}
          
          <a className="deal__link" href="#" onClick={handleContact}>
            Написать заказчику
          </a>
        </div>
      </div>
    </section>
  )
}