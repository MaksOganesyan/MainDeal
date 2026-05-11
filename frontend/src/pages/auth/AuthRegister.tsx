// src/pages/auth/AuthRegister.tsx

import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";

import axios from "axios";

import authService from "@/services/auth/auth.service";

import { UserRole } from "@/services/auth/auth.types";

import "../normalize.css";

import "./AuthRegister.css";

const AuthRegister: React.FC = () => {

  const [isLogin, setIsLogin] = useState(true); // true = показываем вход, false = регистрация

  const [email, setEmail] = useState("");

  const [login, setLogin] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);

  const [isBlocked, setIsBlocked] = useState(false);

  const [blockTimer, setBlockTimer] = useState(5);

  const navigate = useNavigate();

  // ========== ДОБАВИТЬ КОД ДЛЯ СКРЫТИЯ КАРТИНОК ПРИ ЗУМЕ ==========
  useEffect(() => {
    function hideImagesOnZoom() {
      const wrappers = document.querySelectorAll('.registration__image-wrapper, .authorization__image-wrapper');
      
      // Получаем масштаб страницы
      const zoomLevel = Math.round(window.devicePixelRatio * 100);
      
      // Скрываем картинки при масштабе 130% и выше
      if (zoomLevel >= 130) {
        wrappers.forEach(wrapper => {
          (wrapper as HTMLElement).style.display = 'none';
        });
      } else {
        wrappers.forEach(wrapper => {
          (wrapper as HTMLElement).style.display = '';
        });
      }
    }
    
    // Запускаем при загрузке
    hideImagesOnZoom();
    
    // Отслеживаем изменение масштаба
    window.addEventListener('resize', hideImagesOnZoom);
    window.addEventListener('orientationchange', hideImagesOnZoom);
    
    // Проверяем каждые 500 мс (на случай если событие не сработало)
    const interval = setInterval(hideImagesOnZoom, 500);
    
    return () => {
      window.removeEventListener('resize', hideImagesOnZoom);
      window.removeEventListener('orientationchange', hideImagesOnZoom);
      clearInterval(interval);
    };
  }, []);
  // ========== КОНЕЦ ДОБАВЛЕННОГО КОДА ==========

  const resetBlock = () => {
    setIsBlocked(false);
    setBlockTimer(5);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetBlock();
    setEmail("");
    setLogin("");
    setPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBlocked && blockTimer > 0) {
      timer = setInterval(() => {
        setBlockTimer((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            resetBlock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBlocked, blockTimer]);

  // Мутации
  const { mutate: loginMutate, isPending: loginLoading } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authService.main("login", data),
    onSuccess: (res) => {
      resetBlock();
      const userRole = res.data.user.roles?.[0] || UserRole.CUSTOMER;
      if (userRole === UserRole.CUSTOMER) {
        navigate("/deals");
      } else if (userRole === UserRole.EXECUTOR) {
        navigate("/profiles");
      } else {
        navigate("/");
      }
      toast.success("Вход выполнен!");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Ошибка входа";
        toast.error(msg);
        setIsBlocked(true);
        setBlockTimer(5);
      }
    },
  });

  const { mutate: registerMutate, isPending: registerLoading } = useMutation({
    mutationFn: (data: {
      email: string;
      login: string;
      password: string;
      role: UserRole;
    }) => authService.main("register", data),
    onSuccess: () => {
      resetBlock();
      toast.success("Регистрация успешна! Войдите в аккаунт.");
      setIsLogin(true);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Ошибка регистрации";
        toast.error(msg);
        setIsBlocked(true);
        setBlockTimer(5);
      }
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetBlock();

    if (!email || !email.trim()) {
      toast.error("Введите email или логин");
      return;
    }
    if (!password || !password.trim()) {
      toast.error("Введите пароль");
      return;
    }

    loginMutate({ email: email.trim(), password });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetBlock();

    if (!email || !email.trim()) {
      toast.error("Введите email");
      return;
    }
    if (!password || !password.trim()) {
      toast.error("Введите пароль");
      return;
    }
    if (!confirmPassword || !confirmPassword.trim()) {
      toast.error("Подтвердите пароль");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    registerMutate({
      email: email.trim(),
      login: login.trim() || email.trim(),
      password,
      role,
    });
  };

  const isLoading = loginLoading || registerLoading;

  return (
    <>
      <div className="auth__wrapper">
        {/* Registration Section */}
        <section className={`registration ${!isLogin ? "active" : ""}`}>
          <div className="registration__wrapper">
            <div className="registration__image-wrapper">
              <img
                className="registration__image"
                src="/registration_image.png"
                alt="Станок"
              />
            </div>
            <div className="registration__aside">
              <div className="registration__textbox">
                <h2 className="registration__header">Регистрация</h2>
                <p className="registration__description">
                  Создайте аккаунт для доступа к платформе Detail Deal
                </p>
              </div>

              <form
                className="registration__form form"
                onSubmit={handleRegisterSubmit}
                noValidate
              >
                <div className="form__group">
                  <input
                    className="form__field"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isBlocked}
                  />
                </div>

                <div className="form__group">
                  <input
                    className="form__field"
                    type="text"
                    placeholder="Имя пользователя"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    disabled={isBlocked}
                  />
                  <p className="form__description">
                    Если не указан, будет использован email
                  </p>
                </div>

                <div className="form__group">
                  <input
                    className="form__field"
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBlocked}
                  />
                  <p className="form__description">
                    Минимум 5 символов, заглавные и строчные буквы
                  </p>
                </div>

                <div className="form__group">
                  <input
                    className="form__field"
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isBlocked}
                  />
                </div>

                <div className="form__group-radio">
                  <label>
                    <input
                      className="form__radio"
                      type="radio"
                      name="role"
                      value={UserRole.CUSTOMER}
                      checked={role === UserRole.CUSTOMER}
                      onChange={() => setRole(UserRole.CUSTOMER)}
                      disabled={isBlocked}
                    />
                    Заказчик
                  </label>
                  <label>
                    <input
                      className="form__radio"
                      type="radio"
                      name="role"
                      value={UserRole.EXECUTOR}
                      checked={role === UserRole.EXECUTOR}
                      onChange={() => setRole(UserRole.EXECUTOR)}
                      disabled={isBlocked}
                    />
                    Исполнитель
                  </label>
                </div>

                {isBlocked && (
                  <div className="form__alert">
                    Форма заблокирована. Попробуйте снова через {blockTimer}{" "}
                    сек.
                  </div>
                )}

                <button
                  className="form__button"
                  type="submit"
                  disabled={isLoading || isBlocked}
                >
                  {isLoading ? "Загрузка..." : "Создать аккаунт"}
                </button>
              </form>

              <div className="registration__to-authorization">
                <p>Уже есть аккаунт?</p>
                <button type="button" onClick={toggleForm} disabled={isLoading}>
                  Войти
                </button>
              </div>

              <div className="registration__legal">
                <p>
                  Нажимая «Зарегистрироваться», вы подтверждаете, что принимаете{" "}
                  <a href="/terms" className="registration__link">
                    правила сервиса
                  </a>{" "}
                  и ознакомились с{" "}
                  <a href="/privacy" className="registration__link">
                    политикой конфиденциальности
                  </a>
                </p>
              </div>

              <div className="registration__copyright">
                <p>© 2026 ООО «MainDeal»</p>
              </div>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className={`authorization ${isLogin ? "active" : ""}`}>
          <div className="authorization__wrapper">
            <div className="authorization__aside">
              <div className="authorization__textbox">
                <h2 className="authorization__header">Вход</h2>
                <p className="authorization__description">
                  Войдите в свой аккаунт Detail Deal
                </p>
              </div>

              <form
                className="authorization__form form"
                onSubmit={handleLoginSubmit}
                noValidate
              >
                <div className="form__group">
                  <input
                    className="form__field"
                    type="text"
                    placeholder="Имя пользователя или Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isBlocked}
                  />
                </div>

                <div className="form__group">
                  <input
                    className="form__field"
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBlocked}
                  />
                </div>

                {isBlocked && (
                  <div className="form__alert">
                    Форма заблокирована. Попробуйте снова через {blockTimer}{" "}
                    сек.
                  </div>
                )}

                <button
                  className="form__button"
                  type="submit"
                  disabled={isLoading || isBlocked}
                >
                  {isLoading ? "Загрузка..." : "Войти"}
                </button>
              </form>

              <div className="authorization__legal">
                <p>
                  Нажимая «Дальше», вы подтверждаете, что принимаете{" "}
                  <a href="/terms" className="authorization__link">
                    правила сервиса
                  </a>{" "}
                  и ознакомились с{" "}
                  <a href="/privacy" className="authorization__link">
                    политикой конфиденциальности
                  </a>
                </p>
              </div>

              <div className="authorization__to-registration">
                <p>Нет аккаунта?</p>
                <button type="button" onClick={toggleForm} disabled={isLoading}>
                  Зарегистрироваться
                </button>
              </div>

              <div className="authorization__copyright">
                <p>© 2026 ООО «MainDeal»</p>
              </div>
            </div>

            <div className="authorization__image-wrapper">
              <img
                className="authorization__image"
                src="/authorization_image.png"
                alt="Станок"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AuthRegister;
