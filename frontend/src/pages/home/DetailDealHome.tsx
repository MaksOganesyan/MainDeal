import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { announcementsService } from '@/services/announcements.service';
//styles
import './assets/css/detailDealHome.css';

const DetailDealHomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { user, isLoading } = useProfile();

  // Состояние выбранной секции
  const [currentSection, setCurrentSection] = useState<'popular' | 'activ' | 'ispol'>('popular');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Состояния для сортировки
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState<string>("");
  const [sortLabel, setSortLabel] = useState<string>("Сортировка");
  const sortRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Функция выбора сортировки
  const handleSortSelect = (type: string, label: string) => {
    setSortType(type);
    setSortLabel(label);
    setSortOpen(false);
    // TODO: здесь будет логика сортировки announcements
  };

  useEffect(() => {
    // Redirect authenticated users to their dashboards
    if (!isLoading && user && user.isLoggedIn) {
      if (user.isCustomer) {
        navigate("/dashboard/customer");
      } else if (user.isExecutor) {
        navigate("/dashboard/executor");
      }
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Загрузка объявлений
    const loadAnnouncements = async () => {
      try {
        setLoadingAnnouncements(true);
        const data = await announcementsService.getAll();
        // Убеждаемся, что data всегда массив
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
        setAnnouncements([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    loadAnnouncements();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex flex-col w-full">

      {/*HEAD CONTENT */}
      <section className="head-section w-full relative isolate overflow-hidden text-white flex flex-col justify-center items-center gap-14 px-4 sm:px-8 lg:px-10 pt-16 pb-10 sm:pb-14 min-h-[560px] mx-auto">
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch w-full max-w-[1220px] mx-auto">
          {/* Левая текстовая колонка */}
          <div className="flex flex-col w-full md:w-[548px] gap-6">
            <h1 className="css-text-gradient text-[32px] sm:text-[34px] md:text-[34px] lg:text-[32px] font-bold leading-[1.15] m-0 text-left mb-3">
              Добро пожаловать на<br />
              <span className="text-4xl sm:text-5xl md:text-7xl font-bold mt-6 block">Detail Deal!</span>
            </h1>
            <p className="css-text-gradient font-bold mb-7 lg:max-w-[420px] md:max-w-[420px]" style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, lineHeight: 1.36 }}>
              Профессиональная платформа для поиска исполнителей и заказчиков в сфере металлообработки
            </p>

            <ul className="flex flex-col sm:flex-row gap-9">
              {/* Для заказчиков */}
              <li className="flex flex-col justify-between gap-5 items-left bg-transparent border-2 border-[#c9c9c9] backdrop-blur-[12px] rounded-[20px] p-[18px_20px_18px_20px] flex-1 min-w-[220px] max-w-[340px]">
                <div className="bg-gradient-to-r from-[#8ecae6] to-[#1a7fae] bg-clip-text text-transparent text-center [font-size:20px!important] font-medium">Для заказчиков</div>
                <div className="text-[13px]">Размещайте заказы на металлообработку и находите квалифицированных исполнителей с опытом и необходимым оборудованием.</div>
                <ul className="text-white/90 text-[13px] space-y-1 mb-5 pl-0 [&>li]:relative [&>li]:pl-5 [&>li]:before:content-['•'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:text-white/90">
                  <li>Быстрый поиск исполнителей</li>
                  <li>Просмотр портфолио и рейтингов</li>
                  <li>Безопасные сделки</li>
                </ul>
                <button
                  className="css-deal-client"
                  type="button"
                  onClick={() => { window.location.href = "/auth"; }}
                >
                  Начать как заказчик
                </button>
              </li>
              {/* Для исполнителей */}
              <li className="flex flex-col justify-between gap-5 items-left bg-transparent border-2 border-[#c9c9c9] backdrop-blur-[12px] rounded-[20px] p-[18px_20px_18px_20px] flex-1 min-w-[220px] max-w-[340px]">
                <div className="gradient-text-silver bg-clip-text text-transparent text-center [font-size:20px!important] [font-weight:500!important]">Для исполнителей</div>
                <div className="text-[13px]">Создайте свой профиль, добавьте оборудование и портфолио, чтобы получать новые заказы от заказчиков.</div>
                <ul className="text-white/90 text-[13px] space-y-1 mb-5 pl-0 [&>li]:relative [&>li]:pl-5 [&>li]:before:content-['•'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:text-white/90">
                  <li>Создание профессионального профиля </li>
                  <li>Демонстрация оборудования</li>
                  <li>Портфолио выполненных работ</li>
                </ul>

                <button
                  className="css-deal-home"
                  type="button"
                  onClick={() => { window.location.href = "/auth"; }}
                >
                  Начать как исполнитель
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Toggle and Catalog blocks */}
      <section className="bg-[#3b3b3b] min-h-[580px] w-full border-b border-[#262629]">

        <div className='pt-5 bg-[#2b2b2b] '>
          <div className='w-full px-4 sm:px-8 lg:px-[156px]'>
            {/* NAVIGATION */}
            <ul className='flex justify-between px-24 items-center mb-5 w-full'>
              {/* element 1 - Популярные услуги */}
              <li className={`${currentSection === 'popular' ? 'css-navigation-active' : ''} text-center pb-4 relative`}>
                <button
                  data-toggle-section='popular'
                  className="css-navigation-button flex items-center justify-center gap-2 whitespace-nowrap"
                  disabled={currentSection === 'popular'}
                  type="button"
                  onClick={() => setCurrentSection('popular')}
                >
                  Популярные услуги
                  <span className={`tab-badge ${currentSection === 'popular' ? 'active' : ''}`}>
                    {announcements.length}
                  </span>
                </button>
              </li>
              {/* element 2 - Актуальные заказы */}
              <li className={`${currentSection === 'activ' ? 'css-navigation-active' : ''} text-center pb-4 relative`}>
                <button
                  data-toggle-section='activ'
                  className="css-navigation-button flex items-center justify-center gap-2 whitespace-nowrap"
                  type="button"
                  onClick={() => setCurrentSection('activ')}
                >
                  Актуальные заказы
                  <span className={`tab-badge ${currentSection === 'activ' ? 'active' : ''}`}>
                    24
                  </span>
                </button>
              </li>
              {/* element 3 - Исполнители */}
              <li className={`${currentSection === 'ispol' ? 'css-navigation-active' : ''} text-center pb-4 relative`}>
                <button
                  data-toggle-section='ispol'
                  className="css-navigation-button flex items-center justify-center gap-2 whitespace-nowrap"
                  type="button"
                  onClick={() => setCurrentSection('ispol')}
                >
                  Исполнители
                  <span className={`tab-badge ${currentSection === 'ispol' ? 'active' : ''}`}>
                    156
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* POPULAR SECTION */}
        <div
          className={`max-w-[1300px] mx-auto ${currentSection !== 'popular' ? ' hidden' : ''}`}
          data-section='popular'
        >

          {/* Сортировка и виды */}
          <div className="orders-toolbar px-2">
            <div className="orders-toolbar__view">
              <button className="orders-toolbar__button">
                <i className="las la-bars"></i>
              </button>
              <button className="orders-toolbar__button">
                <i className="las la-th-large"></i>
              </button>
              <button className="orders-toolbar__button">
                <i className="las la-map"></i>
              </button>
            </div>

            <div className={`orders-toolbar__sort ${sortOpen ? "orders-toolbar__sort--open" : ""}`} ref={sortRef}>
              <button
                className="orders-toolbar__sort-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen(!sortOpen);
                }}
              >
                <span className="orders-toolbar__sort-label">{sortLabel}</span>
                <span className="orders-toolbar__sort-arrow">&#709;</span>
              </button>
              <div className="orders-toolbar__sort-menu">
                <button
                  className={`orders-toolbar__sort-option ${sortType === "desc" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("desc", "По убыванию цены")}
                >
                  По убыванию цены
                </button>
                <button
                  className={`orders-toolbar__sort-option ${sortType === "asc" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("asc", "По возрастанию цены")}
                >
                  По возрастанию цены
                </button>
                <button
                  className={`orders-toolbar__sort-option ${sortType === "" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("", "Сортировка")}
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          { /**ТЕКУЩИЙ КОНТЕНТ */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 px-2 pb-6">
            {loadingAnnouncements ? (
              <div className="col-span-full flex justify-center py-10">
                <CircularProgress sx={{ color: '#64bcfa' }} />
              </div>
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  to={`/announcements/${announcement.id}`}
                  className="bg-[#232327] max-w-[250px] rounded-[15px] overflow-hidden shadow-[0_2px_14px_0_rgba(10,20,30,0.14)] flex flex-col border border-[#28282b] hover:border-[#64bcfa] transition-all cursor-pointer hover:transform hover:scale-105"
                >
                  <div className="w-full h-[120px] bg-[#151b22] overflow-hidden">
                    {announcement.images && announcement.images.length > 0 ? (
                      <img
                        src={announcement.images[0]}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#151b22] to-[#1a2028]">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-[16px_17px_13px_17px] flex flex-col flex-1">
                    <div className="font-semibold text-white text-[17px] mb-1.5 leading-5 line-clamp-2">
                      {announcement.title}
                    </div>
                    {announcement.region && (
                      <div className="flex items-center text-[#87888a] text-[14px] mb-3">
                        <svg width="17" height="17" fill="none" viewBox="0 0 20 20" className="mr-[5px]">
                          <path fill="#87888a" d="M10 2.5a6 6 0 0 0-6 6c0 4.13 5.39 8.63 5.62 8.82.23.18.54.18.77 0C10.61 17.13 16 12.63 16 8.5a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                        </svg>
                        {announcement.region}
                      </div>
                    )}
                    <div className="flex justify-between items-end mb-2 gap-2">
                      {announcement.price && (
                        <span className="text-white text-[20px] mr-[3px] font-bold">от {announcement.price}₽</span>
                      )}
                      {announcement.deliveryTime && (
                        <span className="text-white text-[14px] font-bold bg-blue-400 p-1 rounded-lg">
                          от {announcement.deliveryTime} дней
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-[#24262a] py-[9px] px-[15px] flex items-center gap-3">
                    {announcement.author?.avatar ? (
                      <img
                        src={announcement.author.avatar}
                        alt={announcement.author.fullName || announcement.author.login}
                        className="w-[28px] h-[28px] rounded-full object-cover border border-[#31333a]"
                        style={{ background: '#222' }}
                      />
                    ) : (
                      <div className="w-[28px] h-[28px] rounded-full bg-[#31333a] flex items-center justify-center text-white text-xs font-bold">
                        {announcement.author?.fullName?.charAt(0) || announcement.author?.login?.charAt(0) || '?'}
                      </div>
                    )}
                    <Link 
                      to={`/executor/${announcement.author?.id || '1'}`}
                      className="text-white font-medium text-[15px] truncate hover:text-blue-400 transition-colors"
                    >
                      {announcement.author?.fullName || announcement.author?.login || 'Аноним'}
                    </Link>
                    {announcement.rating && (
                      <>
                        <span className="flex items-center gap-1 ml-auto text-[#64bcfa] font-bold text-[15px]">
                          <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                            <path d="M10 15.3L4.8 18l1-5.9L1.9 8.9l6-0.9L10 3l2.1 4.9 6 0.9-4 3.2 1 5.9z" fill="#64bcfa" />
                          </svg>
                          {announcement.rating}
                        </span>
                        {announcement.reviewsCount && (
                          <span className="text-[#53bafd] text-[14px] ml-1">({announcement.reviewsCount})</span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400 text-lg">Объявления не найдены</p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIV SECTION */}
        <div
          className={`max-w-[1300px] mx-auto ${currentSection !== 'activ' ? ' hidden' : ''}`}
          data-section='activ'
        >
          {/* Сортировка и виды */}
          <div className="orders-toolbar mb-6 px-2">
            <div className="orders-toolbar__view">
              <button className="orders-toolbar__button">
                <i className="las la-bars"></i>
              </button>
              <button className="orders-toolbar__button">
                <i className="las la-th-large"></i>
              </button>
              <button className="orders-toolbar__button">
                <i className="las la-map"></i>
              </button>
            </div>

            <div className={`orders-toolbar__sort ${sortOpen ? "orders-toolbar__sort--open" : ""}`} ref={sortRef}>
              <button
                className="orders-toolbar__sort-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen(!sortOpen);
                }}
              >
                <span className="orders-toolbar__sort-label">{sortLabel}</span>
                <span className="orders-toolbar__sort-arrow">&#709;</span>
              </button>
              <div className="orders-toolbar__sort-menu">
                <button
                  className={`orders-toolbar__sort-option ${sortType === "desc" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("desc", "По убыванию цены")}
                >
                  По убыванию цены
                </button>
                <button
                  className={`orders-toolbar__sort-option ${sortType === "asc" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("asc", "По возрастанию цены")}
                >
                  По возрастанию цены
                </button>
                <button
                  className={`orders-toolbar__sort-option ${sortType === "" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("", "Сортировка")}
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          <h2 className='text-white'>activ</h2>
        </div>

        {/* ISPOL SECTION */}
        <div
          className={`max-w-[1300px] mx-auto ${currentSection !== 'ispol' ? ' hidden' : ''}`}
          data-section='ispol'
        >
          {/* Сортировка и виды */}
          <div className="orders-toolbar mb-6 ">
            <div className="orders-toolbar__view">
              <button className="orders-toolbar__button">
                <i className="las la-bars"></i>
              </button>
              <button className="orders-toolbar__button">
                <i className="las la-th-large"></i>
              </button>
              <button className="orders-toolbar__button">
                <i className="las la-map"></i>
              </button>
            </div>

            <div className={`orders-toolbar__sort ${sortOpen ? "orders-toolbar__sort--open" : ""}`} ref={sortRef}>
              <button
                className="orders-toolbar__sort-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen(!sortOpen);
                }}
              >
                <span className="orders-toolbar__sort-label">{sortLabel}</span>
                <span className="orders-toolbar__sort-arrow">&#709;</span>
              </button>
              <div className="orders-toolbar__sort-menu">
                <button
                  className={`orders-toolbar__sort-option ${sortType === "desc" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("desc", "По убыванию цены")}
                >
                  По убыванию цены
                </button>
                <button
                  className={`orders-toolbar__sort-option ${sortType === "asc" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("asc", "По возрастанию цены")}
                >
                  По возрастанию цены
                </button>
                <button
                  className={`orders-toolbar__sort-option ${sortType === "" ? "orders-toolbar__sort-option--active" : ""}`}
                  onClick={() => handleSortSelect("", "Сортировка")}
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          <h2 className='text-white'>ispol</h2>
        </div>

      </section>

      {/**background skip */}
      <section className='bg-[#2b2b2b] w-full h-16 '></section>

    </div>
  )
}

export default DetailDealHomePage;