import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../normalize.css";
import "./Footer.css";

import { useProfile } from "../../hooks/useProfile";

export const Footer: React.FC = () => {
  const { user } = useProfile();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (!user.isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer__wrapper">
        {/* Бренд + соцсети */}
        <div className="footer__block">
          <h3 className="footer__title">MAIN DEAL</h3>
          <p className="footer__text">Онлайн-сервис по металлообработке</p>
          <p className="footer__text">Подпишитесь на наши соц. сети</p>
          <div className="footer__socials">
            <img
              src="/vkontakte_icon.svg"
              alt="vkontakte"
              className="footer__social"
            />
            <img
              src="/telegram_icon.svg"
              alt="telegram"
              className="footer__social"
            />
            <img
              src="/rutube_icon.svg"
              alt="rutube"
              className="footer__social"
            />
            <img
              src="/youtube_icon.svg"
              alt="youtube"
              className="footer__social"
            />
          </div>
        </div>

        {/* Навигация */}
        <div className="footer__block">
          <h3 className="footer__title">Страницы</h3>
          <button
            className="footer__link"
            onClick={() =>
              user.isLoggedIn ? navigate("/deals") : navigate("/login")
            }
          >
            Объявления
          </button>
          <button
            className="footer__link"
            onClick={() => handleNavigation("/orders")}
          >
            Заказы
          </button>
          <button
            className="footer__link"
            onClick={() => handleNavigation("/chats")}
          >
            Чаты
          </button>
        </div>

        {/* Документы */}
        <div className="footer__block">
          <h3 className="footer__title">Документы</h3>
          <Link to="/privacy" className="footer__link">Политика конфиденциальности</Link>
          <Link to="/terms" className="footer__link">Пользовательское соглашение</Link>
          <Link to="/cookie" className="footer__link">Политика cookie</Link>
          <Link to="/offer" className="footer__link">Оферта на платные услуги</Link>
          <Link to="/refund" className="footer__link">Политика возвратов</Link>
          <Link to="/sla" className="footer__link">SLA</Link>
          <Link to="/placement" className="footer__link">Правила размещения</Link>
          <Link to="/chat-rules" className="footer__link">Правила чата</Link>
          <Link to="/copyright" className="footer__link">Правообладателям</Link>
          <Link to="/security" className="footer__link">Безопасность аккаунта</Link>
        </div>

        {/* Реквизиты + подписка */}
        <div className="footer__block">
          <h3 className="footer__title">Контакты</h3>
          <p className="footer__text">ИП Иванов Иван Иванович</p>
          <p className="footer__text">ИНН: 000000000000</p>
          <p className="footer__text">ОГРНИП: 000000000000000</p>
          <p className="footer__text">Адрес: Россия, г. Москва</p>
          <p className="footer__text">
            Email:{" "}
            <a href="mailto:support@maindeal.ru" className="footer__external-link">
              support@maindeal.ru
            </a>
          </p>
          <p className="footer__text">
            Телефон:{" "}
            <a href="tel:+78000000000" className="footer__external-link">
              8 (800) 000-00-00
            </a>
          </p>

          <div className="footer__subscribe">
            <p className="footer__text">
              Подпишитесь на рассылку:
            </p>
            <form
              className="footer__form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Функционал подписки — в разработке");
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Введите email"
                required
              />
              <button type="submit">Подписаться</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 ООО «MainDeal». Все права защищены.</p>
      </div>
    </footer>
  );
};
