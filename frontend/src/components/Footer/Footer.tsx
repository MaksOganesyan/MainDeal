import React from "react";
import { useNavigate } from "react-router-dom"; // ← Link удалён!
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

        <div className="footer__block">
          <h3 className="footer__title">Заинтересовались?</h3>
          <p className="footer__text">
            Оставьте свою электронную почту и подпишитесь на нашу рассылку,
            чтобы всегда быть в курсе наших новостей
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
              placeholder="Введите свой email"
              required
            />
            <button type="submit">Подписаться</button>
          </form>
        </div>
      </div>
    </footer>
  );
};
