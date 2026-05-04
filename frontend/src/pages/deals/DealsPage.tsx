import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { DealsService } from '@/services/deals.service';
import { IDeal } from '@/types/detail-deal.types';
import { useProfile } from '@/hooks/useProfile';
import cardImage from '@/pages/executor/images/card.png';

const DealsPage: React.FC = () => {
  const { user } = useProfile();
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'inprogress' | 'completed'>('active');

  useEffect(() => { loadDeals(); }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await DealsService.getDeals();
      setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить заказ?')) return;
    try {
      await DealsService.deleteDeal(id);
      setDeals(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const activeDeals = deals.filter(d => d.status === 'ACTIVE');
  const inProgressDeals = deals.filter(d => d.status === 'IN_PROGRESS');
  const completedDeals = deals.filter(d => d.status === 'COMPLETED');

  const tabDeals =
    tab === 'active' ? activeDeals :
    tab === 'inprogress' ? inProgressDeals :
    completedDeals;

  const tabs = [
    { key: 'active', label: 'Активные заказы', count: activeDeals.length },
    { key: 'inprogress', label: 'Заказы в работе', count: inProgressDeals.length },
    { key: 'completed', label: 'Выполненные Заказы', count: completedDeals.length },
  ];

  const uploadsUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://dd.ilyacode.ru'
    : 'http://localhost:4200';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" sx={{ bgcolor: '#2b2b2b' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#2b2b2b', color: '#fff' }}>

      {/* TOP — хлебные крошки + заголовок */}
      <Box sx={{ bgcolor: '#2b2b2b', px: 6, pt: 4, pb: 0 }}>
        <Typography sx={{ fontSize: 16, color: '#8a8a9a', mb: 1 }}>
          ГЛАВНАЯ • МОИ ЗАКАЗЫ
        </Typography>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 36, color: '#51ADD9', fontWeight: 700, mb: 3 }}>
          Мои заказы
        </Typography>

        {/* Разделитель над табами */}
        <Box sx={{ width: '100%', height: 1, bgcolor: '#3B3B3B' }} />

        {/* TABS */}
        <Box sx={{ width: '100%', borderBottom: '1px solid #3a3a4a' }}>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, width: '100%' }}>
            {tabs.map(({ key, label, count }) => (
              <li key={key} style={{ position: 'relative', flex: 1 }}>
                <button
                  type="button"
                  onClick={() => setTab(key as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    height: 64,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 22,
                    fontWeight: tab === key ? 600 : 400,
                    lineHeight: '140%',
                    color: tab === key ? '#ffffff' : '#8a8a9a',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 38,
                    height: 30,
                    borderRadius: 20,
                    background: tab === key ? '#1A7FAE' : '#4a4a4a',
                    color: '#fff',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 16,
                    fontWeight: 400,
                  }}>
                    {count}
                  </span>
                </button>
                {tab === key && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: 3,
                    borderRadius: 2,
                    background: '#1A7FAE',
                  }} />
                )}
              </li>
            ))}
          </ul>
        </Box>
      </Box>

      {/* BOTTOM — карточки */}
      <Box sx={{ bgcolor: '#3b3b3b', minHeight: 400, px: 6, pt: 5, pb: 6 }}>
        {tabDeals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontSize: 22, color: '#8a8a9a' }}>
              Заказов пока нет
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 3,
          }}>
            {tabDeals.map((deal) => {
              const firstImage = deal.attachments && deal.attachments.length > 0 ? deal.attachments[0] : null;

              return (
                <Box
                  key={deal.id}
                  sx={{
                    bgcolor: '#2b2b2b',
                    borderRadius: 3,
                    border: '1px solid #3a3a4a',
                    overflow: 'hidden',
                    '&:hover': { border: '1px solid #1A7FAE' },
                    transition: 'border 0.2s',
                    position: 'relative',
                  }}
                >
                  {/* Бейдж с количеством, нумерация заказаов, если нужно убрать комментарий
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: '#1A7FAE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    zIndex: 1,
                  }}>
                    {deal.id}
                  </Box>
                  */}

                  {/* Image */}
                  {firstImage ? (
                    <Box
                      component="img"
                      src={`${uploadsUrl}${firstImage}`}
                      alt={deal.title}
                      sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                      onError={(e: any) => { e.target.src = cardImage; }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={cardImage}
                      alt={deal.title}
                      sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  )}

                  {/* Content */}
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5, color: '#fff' }}>
                      {deal.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mb: 1.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: '#8a8a9a' }} />
                      <Typography sx={{ fontSize: 16, color: '#8a8a9a' }}>
                        {deal.location ?? 'Москва, Комсомольская'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                      {deal.budget && (
                        <Typography sx={{ fontSize: 24, fontWeight: 500, color: '#fff'}}>
                          от {deal.budget.toLocaleString('ru-RU')}₽
                        </Typography>
                      )}
                      <Typography sx={{ fontSize: 16, color: '#fff' }}>
                        от 10 дней
                      </Typography>
                    </Box>

                    {/* Кнопки редактировать и удалить */}
                    {user?.isCustomer && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          component={Link}
                          to={`/deals/${deal.id}/edit`}
                          sx={{
                            minWidth: 36,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: '#1A7FAE',
                            color: '#fff',
                            p: 0,
                            '&:hover': { bgcolor: '#1565a0' },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(deal.id)}
                          sx={{
                            minWidth: 36,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: '#3a3a4a',
                            color: '#fff',
                            p: 0,
                            '&:hover': { bgcolor: '#e53935' },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DealsPage;