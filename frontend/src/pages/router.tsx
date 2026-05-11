import { ExecutorProfilePage } from "./executor/ExecutorProfilePage";
import { createBrowserRouter } from "react-router-dom";
import DetailDealHomePage from "./home/DetailDealHome";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { RedirectIfAuth } from "./RedirectIfAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout/Layout";

// Аутентификация
import AuthRegister from "./auth/AuthRegister";

// Страницы сделок
import ProfilesPage from "./profiles/ProfilesPage";
import ProfileDetailPage from "./profiles/ProfileDetailPage";
import CreateProfilePage from "./profiles/CreateProfilePage";
import DealsPage from "./deals/DealsPage";
import CreateDealPage from "./deals/CreateDealPage";
import DealPage from "./deals/DealPage";
import EditDealPage from "./deals/EditDealPage";
import CustomerDashboard from "./dashboard/CustomerDashboard";
import ExecutorDashboard from "./dashboard/ExecutorDashboard";
import UserSettingsPage from "./settings/UserSettingsPage";

// Объявления
import AnnouncementsPage from "./announcements/AnnouncementsPage";
import CreateAnnouncementPage from "./announcements/CreateAnnouncementPage";
import MyAnnouncementsPage from "./announcements/MyAnnouncementsPage";
import AnnouncementDetailPage from "./announcements/AnnouncementDetailPage";

// Менеджер
import ManagerDashboard from "./manager/ManagerDashboard";
import ManagerChatsPage from "./manager/ManagerChatsPage";
import ManagerChatRoomPage from "./manager/ManagerChatRoomPage";

// Чаты
import ChatsPage from "./chats/ChatsPage";
import ChatManagment from "./chats/ChatManagment";
import ChatRoomPage from "./chats/ChatRoomPage";
import NewChatPage from "./chats/NewChatPage";

// Отклики
import MyResponsesPage from "./responses/MyResponsesPage";

// Исполнитель
import ExecutorDealsPage from "./executor/ExecutorDealsPage";
import { AllOrdersExecutor } from "./executor/AllOrdersPage";

// Заказчик
import { AllOrdersCustomer } from "./customer/allOrdersCustomer";
import { customerProfile as CustomerProfile } from "./customer/customerProfile";

// Карточка заказа
import OrderCardDet from "./ordercarddet/OrderCardDet";

// Правовые страницы
import PrivacyPage from "./legal/PrivacyPage";
import TermsPage from "./legal/TermsPage";

import { PUBLIC_PAGES } from "@/config/pages/public.config";

export const router = createBrowserRouter([
  // Публичная главная страница
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <DetailDealHomePage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "executor/all-orders",
        element: <AllOrdersExecutor />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "hidden/executor-profile",
        element: <ExecutorProfilePage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "hidden/ordersCustomer",
        element: <AllOrdersCustomer />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "terms",
        element: <TermsPage />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },

  // Страницы авторизации (редирект если уже залогинен)
  {
    element: <RedirectIfAuth />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: PUBLIC_PAGES.LOGIN,
            element: <AuthRegister />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: PUBLIC_PAGES.REGISTER,
            element: <AuthRegister />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: PUBLIC_PAGES.AUTH,
            element: <AuthRegister />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },

  // Защищенные страницы (требуют авторизацию)
  {
    element: <ProtectedRoutes />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Layout />,
        children: [
          // Маршруты дашбордов
          {
            path: "/dashboard/customer",
            element: <CustomerDashboard />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/dashboard/executor",
            element: <ExecutorDashboard />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты сделок
          {
            path: "/profiles",
            element: <ProfilesPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/profiles/:id",
            element: <ProfileDetailPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/profiles/create",
            element: <CreateProfilePage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/settings",
            element: <UserSettingsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/deals",
            element: <DealsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/deals/create",
            element: <CreateDealPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/deals/:id",
            element: <DealPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/deals/:id/edit",
            element: <EditDealPage />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты объявлений
          {
            path: "/announcements",
            element: <AnnouncementsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/announcements/create",
            element: <CreateAnnouncementPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/announcements/my",
            element: <MyAnnouncementsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/announcements/:id",
            element: <AnnouncementDetailPage />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты чатов
          {
            path: "/chats",
            element: <ChatsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/chats/management",
            element: <ChatManagment />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/chats/new",
            element: <NewChatPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/chats/:id",
            element: <ChatRoomPage />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты откликов
          {
            path: "/responses/my",
            element: <MyResponsesPage />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты исполнителя
          {
            path: "/executor/:id",
            element: <ExecutorProfilePage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/executor/deals",
            element: <ExecutorDealsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/executor/orders",
            element: <AllOrdersExecutor />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты заказчика
          {
            path: "/customer/orders",
            element: <AllOrdersCustomer />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/customer/:id",
            element: <CustomerProfile />,
            errorElement: <ErrorBoundary />,
          },

          // Карточка заказа (моковый макет, теперь динамический по id)
          {
            path: "/ordercarddet/:id",
            element: <OrderCardDet />,
            errorElement: <ErrorBoundary />,
          },

          // Маршруты менеджера
          {
            path: "/manager",
            element: <ManagerDashboard />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/manager/chats",
            element: <ManagerChatsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/manager/chats/:id",
            element: <ManagerChatRoomPage />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <ErrorBoundary />,
    errorElement: <ErrorBoundary />,
  },
]);
