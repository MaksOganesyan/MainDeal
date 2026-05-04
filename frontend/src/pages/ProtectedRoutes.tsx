import { PUBLIC_PAGES } from "@/config/pages/public.config";
import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export const ProtectedRoutes = () => {
  const { user, isLoading } = useProfile();

  if (isLoading) return <div>Loading...</div>;

  // Для cookie-based аутентификации проверяем user через API
  if (!user || !user.isLoggedIn) {
    return <Navigate to={PUBLIC_PAGES.AUTH} replace />;
  }

  return <Outlet />;
};
