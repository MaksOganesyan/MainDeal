import { axiosClassic } from '@/api/axios';
import { IFormData, IUser } from '@/types/types';

// Убраны JWT токены - используем cookies от бэкенда NestJS
interface IAuthResponse {
  user: IUser;
  // accessToken больше не используется - бэкенд устанавливает cookies
}

// Убран enum EnumTokens - больше не нужен для cookies
class AuthService {
  async main(type: 'login' | 'register', data: IFormData) {
    // Cookies устанавливаются автоматически бэкендом
    const response = await axiosClassic.post<IAuthResponse>(`/auth/${type}`, data);
    return response;
  }

  async logout() {
    // Cookies очищаются автоматически бэкендом
    const response = await axiosClassic.post('/auth/logout');
    return response;
  }

  async getCurrentUser() {
    // Бэкенд читает cookies автоматически
    const response = await axiosClassic.get<{ user: IUser }>('/auth/me');
    return response.data.user;
  }
}

export const authService = new AuthService();
export default authService;
