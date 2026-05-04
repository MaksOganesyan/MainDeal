// src/router/RedirectIfAuth.tsx
import { Outlet } from "react-router-dom";

export const RedirectIfAuth = () => {
  // Для cookie-based аутентификации редирект обрабатывается бэкендом
  // или проверкой через authService.getCurrentUser()
  return <Outlet />;
};
