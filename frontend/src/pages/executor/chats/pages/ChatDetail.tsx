import React from "react";
import "../styles/ChatDetail.css";

export const ChatDetail: React.FC = () => {
  const mockData = {
    manager: {
      name: "Евгений",
      avatar: "/src/pages/executor/images/manager.png"
    },
    customer: {
      name: "Александр",
      avatar: "/src/pages/executor/images/Client.png"
    },
    order: "Лазерная резка по металлу",
    messages: [
      {
        id: 1,
        sender: "manager",
        text: "Здравствуйте, Иван! Вам поступил заказ, имеется чертеж",
        time: "10:30",
        isOwn: false
      },
      {
        id: 2,
        sender: "manager",
        text: "Чертеж резки по листу металла.jpg",
        time: "10:32",
        isOwn: false,
        hasFile: true,
        fileName: "Чертеж_резки_по_листу_металла.jpg",
        fileUrl: "/src/pages/executor/images/drawing.png"
      },
      {
        id: 3,
        sender: "customer",
        text: "Здравствуйте, я готов взяться за заказ, чертеж меня устраивает, работу могу выполнить в течении 20 дней",
        time: "10:35",
        isOwn: true
      },
      {
        id: 4,
        sender: "manager",
        text: "Хорошо! Передаю информацию заказчику",
        time: "10:38",
        isOwn: false
      }
    ]
  };

  return (
    <div className="wrapper">
      <div className="chat-detail">
        <div className="chat-detail__header">
          <div className="chat-detail__participant">
            <div className="chat__avatar-wrapper">
              <img
                className="chat-detail__avatar"
                src={mockData.manager.avatar}
                alt="avatar"
              />
            </div>
            <span className="chat-detail__participant-name">{mockData.manager.name}</span>
          </div>
          <div className="chat-detail__participant-label">Менеджер</div>
        </div>

        <div className="chat-detail__messages">
          {mockData.messages.map((message) => (
            <div
              key={message.id}
              className={`chat-detail__message ${message.isOwn ? "chat-detail__message--own" : "chat-detail__message--other"}`}
            >
              <div className="chat-detail__message-avatar">
                {message.isOwn ? (
                  <img
                    className="chat-detail__avatar"
                    src={mockData.customer.avatar}
                    alt="customer"
                  />
                ) : (
                  <div className="chat__avatar-wrapper">
                    <img
                      className="chat-detail__avatar"
                      src={mockData.manager.avatar}
                      alt="manager"
                    />
                  </div>
                )}
              </div>
              <div className="chat-detail__message-content">
                <div className="chat-detail__message-bubble">
                  <div className="chat-detail__message-text">{message.text}</div>
                  {message.hasFile && (
                    <div className="chat-detail__file-attachment">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                      </svg>
                      <span className="chat-detail__file-name">{message.fileName}</span>
                    </div>
                  )}
                </div>
                <div className="chat-detail__message-time">{message.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-detail__footer">
          <button className="chat-detail__attach-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <textarea
            className="chat-detail__input"
            placeholder="Введите сообщение..."
            rows={1}
          />
          <button className="chat-detail__send-btn">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="block"></div>
    </div>
  );
};