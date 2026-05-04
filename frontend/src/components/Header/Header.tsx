import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/auth/auth.service";
import { ChatService } from "@/services/chat.service";
import { UserRole } from "@/services/auth/auth.types";

import "../normalize.css";
import "./Header.css";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useProfile();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        anchorElUser &&
        menuRef.current &&
        avatarRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setAnchorElUser(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorElUser]);

  useEffect(() => {
    if (user?.isLoggedIn) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.isLoggedIn]);

  const loadUnreadCount = async () => {
    try {
      const count = await ChatService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    handleCloseUserMenu();
    window.location.href = "/auth";
  };

  const isAuthenticated = user && user.isLoggedIn === true;
  
  const isManager =
    user?.roles?.includes(UserRole.MANAGER) ||
    user?.roles?.includes(UserRole.ADMIN);

  const getHomeLink = () => {
    if (!isAuthenticated) return "/";
    if (isManager) return "/manager";
    if (user.isCustomer) return "/dashboard/customer";
    if (user.isExecutor) return "/dashboard/executor";
    return "/";
  };

  const getDisplayName = () => {
    if (!user?.email) return "ПОЛЬЗОВАТЕЛЬ";
    return user.email.split("@")[0].toUpperCase();
  };

  const getAvatarUrl = () => {
    return "/default_avatar.svg";
  };

  return (
    <header className="header">
      <div className="header__wrapper">
        {/* Логотип */}
        <div className="logotype">
          <img
            className="logotype__image"
            src="/logo.svg"
            alt="Изысканная деталь"
          />
          <div className="logotype__textbox">
            <p className="logotype__text-title">
              <Link to={getHomeLink()} className="logo-link">
                DETAIL DEAL
              </Link>
            </p>
            <p className="logotype__text-description">
              Онлайн-сервис по металлообработке
            </p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="navigation">
          {!isAuthenticated && (
            <>
              <li className="navigation__item">
                <Link to="/announcements" className="navigation__link">
                  Объявления
                </Link>
              </li>
              <li className="navigation__item">
                <Link to="/deals" className="navigation__link">
                  Заказы
                </Link>
              </li>
              <li className="navigation__item">
                <Link to="/chats" className="navigation__link">
                  Чаты
                </Link>
              </li>
              <li className="navigation__item navigation__item-button">
                <Link 
                  to="/auth" 
                  className="navigation__link"
                  onClick={() => console.log("Login button clicked!")}
                >
                  {" "}
                  {/* ← ЕДИНСТВЕННОЕ ИЗМЕНЕНИЕ */}
                  Войти
                </Link>
              </li>
            </>
          )}
        </nav>

        {isManager && (
          <>
            <li className="navigation__item">
              <Link to="/manager/chats" className="navigation__link">
                Чаты
              </Link>
            </li>
            <li className="navigation__item">
              <Link to="/manager/deals" className="navigation__link">
                Заказы
              </Link>
            </li>
            <li className="navigation__item">
              <Link to="/manager/users" className="navigation__link">
                Пользователи
              </Link>
            </li>
            <li className="navigation__item">
              <Link to="/manager/complaints" className="navigation__link">
                Жалобы
              </Link>
            </li>
            <div
              className="user-avatar"
              onClick={handleOpenUserMenu}
              ref={avatarRef}
            >
              <div className="user-avatar__name">{getDisplayName()}</div>
              {anchorElUser && (
                <div className="user-menu" ref={menuRef}>
                  <div
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/manager");
                      handleCloseUserMenu();
                    }}
                  >
                    Мой профиль
                  </div>
                  <div
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/settings");
                      handleCloseUserMenu();
                    }}
                  >
                    Настройки профиля
                  </div>
                  <div className="user-menu-item" onClick={handleLogout}>
                    Выйти
                  </div>
                </div>
              )}
              <img
                className="user-avatar__image"
                src={getAvatarUrl()}
                alt="Аватар пользователя"
              />
            </div>
          </>
        )}

        {isAuthenticated && user.isExecutor && !isManager && (
          <>
            <nav className="navigation">
              <li className="navigation__item">
                <Link to="/deals" className="navigation__link">
                  Мои заказы
                </Link>
              </li>
              <li className="navigation__item">
                <Link to="/announcements/my" className="navigation__link">
                  Мои объявления
                </Link>
              </li>
              <li className="navigation__item">
                <Link to="/chats" className="navigation__link">
                  Чаты
                </Link>
              </li>
            </nav>
            <div className="user__container">
              <div className="navigation__item-button">
                <Link to="/deals/create" className="navigation__link">
                  Создать заказ
                </Link>
              </div>
              <div
                className="user__menu-clickable"
                onClick={handleOpenUserMenu}
                ref={avatarRef}
              >
                <div className="user-avatar">
                  <div className="user-avatar__name">{getDisplayName()}</div>
                  <img
                    className="user-avatar__image"
                    src={getAvatarUrl()}
                    alt="Аватар пользователя"
                  />
                </div>
                {anchorElUser && (
                  <div className="user-menu" ref={menuRef}>
                    {user.isExecutor && (
                      <div
                        className="user-menu-item"
                        onClick={() => {
                          navigate(`/executor/${user.id}`);
                          handleCloseUserMenu();
                        }}
                      >
                        Мой профиль
                      </div>
                    )}
                    <div
                      className="user-menu-item"
                      onClick={() => {
                        navigate("/settings");
                        handleCloseUserMenu();
                      }}
                    >
                      Настройки профиля
                    </div>
                    <div className="user-menu-item" onClick={handleLogout}>
                      Выйти
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {isAuthenticated &&
          user.isCustomer &&
          !user.isExecutor &&
          !isManager && (
            <>
              <nav className="navigation">
                <li className="navigation__item">
                  <Link to="/announcements" className="navigation__link">
                    Объявления
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link to="/deals" className="navigation__link">
                    Мои заказы
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link to="/chats" className="navigation__link">
                    {unreadCount > 0 && (
                      <span className="badge">{unreadCount}</span>
                    )}
                    Чаты
                  </Link>
                </li>
              </nav>
              <div className="user__container">
                <div className="navigation__item-button">
                  <Link to="/deals/create" className="navigation__link">
                    Создать заказ
                  </Link>
                </div>
                <div
                  className="user-avatar"
                  onClick={handleOpenUserMenu}
                  ref={avatarRef}
                >
                  <div className="user-avatar__name">{getDisplayName()}</div>
                  {anchorElUser && (
                    <div className="user-menu" ref={menuRef}>
                      {user.isCustomer && (
                        <div
                          className="user-menu-item"
                          onClick={() => {
                            navigate(`/customer/${user.id}`);
                            handleCloseUserMenu();
                          }}
                        >
                          Мой профиль
                        </div>
                      )}
                      <div
                        className="user-menu-item"
                        onClick={() => {
                          navigate("/settings");
                          handleCloseUserMenu();
                        }}
                      >
                        Настройки профиля
                      </div>
                      <div className="user-menu-item" onClick={handleLogout}>
                        Выйти
                      </div>
                    </div>
                  )}
                  <img
                    className="user-avatar__image"
                    src={getAvatarUrl()}
                    alt="Аватар пользователя"
                  />
                </div>
              </div>
            </>
          )}
      </div>
    </header>
  );
};
