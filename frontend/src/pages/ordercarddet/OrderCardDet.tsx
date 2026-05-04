import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { announcementsService } from '@/services/announcements.service'
import styles from './OrderCardDet.module.css'

type Announcement = {
  id: number
  title: string
  description: string
  category: string
  priceFrom?: number
  estimatedDays?: number
  region?: string
  location?: string
  images?: string[]
  isUrgent?: boolean
}

const getUploadsUrl = () =>
  import.meta.env.VITE_NODE_ENV === 'production' ? 'https://dd.ilyacode.ru' : 'http://localhost:4200'

const OrderCardDet: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const announcement = await announcementsService.getOne(Number(id))
        setData(announcement)
        setError(null)
      } catch (err) {
        setError('Не удалось загрузить объявление')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const uploadsUrl = useMemo(() => getUploadsUrl(), [])
  const images = data?.images ?? []
  const mainImage = images[0]
  const thumbImages = images.slice(1)
  const hasImages = images.length > 0

  if (loading) {
    return <div className={styles.loader}>Загрузка...</div>
  }

  if (error || !data) {
    return <div className={styles.loader}>{error ?? 'Данные не найдены'}</div>
  }

  return (
    <div className={styles.orderCardPage}>
      <div className={styles.orderCardContent}>
        <div className={styles.orderLayout}>
          <div className={styles.orderLeft}>
            <h1 className={styles.orderTitle}>{data.title}</h1>

            {hasImages && (
              <div className={styles.orderGallery}>
                <div
                  className={styles.galleryMain}
                  style={{
                    backgroundImage: `url(${uploadsUrl}${mainImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                {thumbImages.length > 0 && (
                  <div className={styles.galleryThumbs}>
                    {thumbImages.map((img, index) => (
                      <div
                        key={img + index}
                        className={styles.thumb}
                        style={{
                          backgroundImage: `url(${uploadsUrl}${img})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.orderField}>
              <div className={styles.orderLabel}>Категория</div>
              <div className={styles.orderValue}>{data.category}</div>
            </div>

            <div className={styles.orderField}>
              <div className={styles.orderLabel}>Описание заказа</div>
              <div className={styles.orderText}>{data.description}</div>
            </div>

            <div className={styles.orderField}>
              <div className={styles.orderLabel}>Материалы</div>
              <div className={styles.orderText}>Материалы заполняются в форме (нет данных)</div>
            </div>
          </div>

          <div className={styles.orderRight}>
            {data.isUrgent && (
              <div className={styles.urgentRow}>
                <div className={styles.urgentChip}>
                  <span className={styles.zapIcon} />
                </div>
                <div className={styles.urgentText}>Срочный заказ</div>
              </div>
            )}

            <div className={styles.orderCard}>
              <div className={styles.orderCardSection}>
                <div className={styles.orderLabel}>Цена от</div>
                <div className={styles.orderPrice}>{data.priceFrom ? `${data.priceFrom} ₽` : 'Не указана'}</div>
              </div>

              <div className={styles.orderCardSection}>
                <div className={styles.orderLabel}>Срок выполнения</div>
                <div className={styles.orderPrice}>
                  {data.estimatedDays ? `До ${data.estimatedDays} дней` : 'Не указан'}
                </div>
              </div>

              <div className={styles.orderCardSection}>
                <div className={styles.orderLabel}>Местоположение</div>
                <div className={styles.orderLocation}>{data.location || data.region || 'Не указано'}</div>
              </div>

              <button className={styles.primaryBtn}>
                <span className={styles.btnIcon} />
                <span className={styles.btnText}>Откликнуться на заказ</span>
              </button>
              <button className={styles.secondaryBtn}>
                <span className={styles.btnIcon} />
                <span className={styles.btnText}>Написать заказчику</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OrderCardDet
