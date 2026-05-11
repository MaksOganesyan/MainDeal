import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExecutorAllOrdersPage.css';

interface Deal {
  id: number;
  title: string;
  category: string;
  location: string;
  price: number;
  urgency?: string;
  timeline?: string;
  customer: {
    id: number;
    name: string;
    avatar?: string;
  };
  image?: string;
}

export default function ExecutorAllOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [wholesaleOnly, setWholesaleOnly] = useState(false);
  const [singleOnly, setSingleOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Категория 2');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Моковые данные для демонстрации
  const mockDeals: Deal[] = [
    {
      id: 1,
      title: 'Необходима Фигурная резка по металлу',
      category: 'Металлообработка',
      location: 'Москва, Комсомольская',
      price: 1000,
      urgency: 'Срочно',
      customer: {
        id: 1,
        name: 'Александр',
        avatar: '/default_avatar.svg'
      },
      image: '/deal1.jpg'
    },
    {
      id: 2,
      title: 'Необходима Фигурная резка по пластику',
      category: 'Обработка пластика',
      location: 'Москва, Комсомольская',
      price: 10000,
      timeline: 'Срок 2 недели',
      customer: {
        id: 2,
        name: 'Олег',
        avatar: '/default_avatar.svg'
      },
      image: '/deal2.jpg'
    },
    {
      id: 3,
      title: 'Необходима Фигурная резка по дереву',
      category: 'Обработка дерева',
      location: 'Москва, Комсомольская',
      price: 5000,
      urgency: 'Срочно',
      customer: {
        id: 3,
        name: 'Александр',
        avatar: '/default_avatar.svg'
      },
      image: '/deal3.jpg'
    },
    {
      id: 4,
      title: 'Необходима Фигурная резка по стеклу',
      category: 'Обработка стекла',
      location: 'Москва, Комсомольская',
      price: 1000,
      timeline: 'срок 1 недя',
      customer: {
        id: 4,
        name: 'Александр',
        avatar: '/default_avatar.svg'
      },
      image: '/deal4.jpg'
    }
  ];

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setDeals(mockDeals);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDealClick = (dealId: number) => {
    navigate(`/deals/${dealId}`);
  };

  const handleCustomerClick = (customerId: number) => {
    navigate(`/customer/${customerId}`);
  };

  if (loading) {
    return (
      <div className="all-orders-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-orders-page">
      {/* Header с навигацией */}
      <header className="navigation">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon"></div>
            <div className="logo-text">
              <h1>MAIN DEAL</h1>
              <p>Онлайн-сервис по металлообработке</p>
            </div>
          </div>
          
          <div className="nav-menu">
            <button className="nav-button">Объявления</button>
            <button className="nav-button">Заказы</button>
            <button className="nav-button">Чаты</button>
          </div>

          <div className="nav-user">
            <div className="user-avatar">
              <img src="/default_avatar.svg" alt="Аватар" />
            </div>
            <button className="logout-button">
              <span className="logout-icon"></span>
            </button>
          </div>
        </div>

        <div className="nav-search">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Поиск заказов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button"></button>
          </div>
          <div className="nav-location">
            <span className="location-icon"></span>
            <span>Москва</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>главная</span>
        <span className="breadcrumb-dot"></span>
        <span>Все заказы</span>
        <span className="breadcrumb-dot"></span>
        <span className="breadcrumb-active">Категория 2</span>
      </div>

      {/* Page Title */}
      <div className="page-header">
        <h1>Все заказы - Категория 2</h1>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Filters */}
        <div className="sidebar">
          {/* Search */}
          <div className="filter-section">
            <h3>Регион</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Поиск"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="filter-section">
            <h3>Сроки выполнения</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>Срочный заказ</span>
              </label>
            </div>
          </div>

          {/* Volume */}
          <div className="filter-section">
            <h3>Объем выполнения</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={wholesaleOnly}
                  onChange={(e) => setWholesaleOnly(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>Оптовый заказ</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={singleOnly}
                  onChange={(e) => setSingleOnly(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>Единичная деталь</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3>Категории</h3>
            <div className="category-list">
              <div className="category-item">Категория 1</div>
              <div className="category-item active">Категория 2</div>
              <div className="category-item">Категория 3</div>
              <div className="category-item">Категория 4</div>
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3>Стоимость, ₽</h3>
            <div className="price-inputs">
              <div className="search-bar">
                <input
                  type="number"
                  placeholder="От"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                />
              </div>
              <div className="search-bar">
                <input
                  type="number"
                  placeholder="До"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Sort Controls */}
          <div className="sort-controls">
            <div className="sort-options">
              <button className="sort-button">
                <span className="menu-icon"></span>
                <span className="menu-icon"></span>
                <span className="menu-icon"></span>
              </button>
              <button className="sort-button">
                <span className="grid-icon"></span>
                <span className="grid-icon"></span>
                <span className="grid-icon"></span>
                <span className="grid-icon"></span>
              </button>
              <button className="map-button">
                <span className="map-icon"></span>
              </button>
            </div>
            <div className="sort-dropdown">
              <span>Сортировка</span>
              <span className="dropdown-arrow"></span>
            </div>
          </div>

          {/* Deal Cards */}
          <div className="deals-grid">
            {deals.map((deal) => (
              <div key={deal.id} className="deal-card" onClick={() => handleDealClick(deal.id)}>
                <div className="deal-image">
                  <img src={deal.image || '/placeholder-deal.jpg'} alt={deal.title} />
                </div>
                <div className="deal-content">
                  <div className="deal-header">
                    <h3>{deal.title}</h3>
                    <div className="deal-location">
                      <span className="location-icon"></span>
                      <span>{deal.location}</span>
                    </div>
                  </div>
                  <div className="deal-info">
                    <div className="deal-price">{deal.price.toLocaleString('ru-RU')}₽</div>
                    <div className="deal-meta">
                      {deal.urgency && <span className="deal-urgency">{deal.urgency}</span>}
                      {deal.timeline && <span className="deal-timeline">{deal.timeline}</span>}
                    </div>
                  </div>
                  <div className="deal-divider"></div>
                  <div className="deal-footer">
                    <div className="customer-info">
                      <div className="customer-avatar">
                        <img src={deal.customer.avatar || '/default_avatar.svg'} alt={deal.customer.name} />
                      </div>
                      <span>{deal.customer.name}</span>
                    </div>
                    <button className="respond-button">Откликнуться</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2>MAIN DEAL</h2>
            <div className="footer-info">
              <p>Онлайн-сервис по металлообработке</p>
              <div className="social-links">
                <a href="#" className="social-link vk"></a>
                <a href="#" className="social-link telegram"></a>
                <a href="#" className="social-link rutube"></a>
                <a href="#" className="social-link youtube"></a>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Страницы</h3>
            <div className="footer-links">
              <a href="/announcements">Объявления</a>
              <a href="/deals">Заказы</a>
              <a href="/chats">Чаты</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Заинтересовались?</h3>
            <div className="subscribe-form">
              <p>Оставьте свою электронную почту и подпишитесь на нашу рассылку, чтобы всегда быть в курсе наших новостей</p>
              <div className="subscribe-input">
                <input type="email" placeholder="Enter your email here" />
                <button className="subscribe-button">Подписаться</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
