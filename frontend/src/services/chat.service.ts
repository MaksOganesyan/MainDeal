import { api } from '@/api/axios';
import { IChatRoom, IChatMessage, MessageType } from '@/types/detail-deal.types';

export interface CreateChatMessageDto {
  content: string;
  type?: MessageType;
  attachments?: string[];
  recipientId?: number;  // For managers: specify recipient (customer or executor)
}

export interface CreateChatRoomDto {
  memberIds: number[];
}

export interface MarkAsReadDto {
  isRead?: boolean;
}

export class ChatService {
  static async createRoom(dealId: number, data: CreateChatRoomDto): Promise<IChatRoom> {
    const response = await api.post('/chat/rooms', { dealId, ...data });
    return response.data;
  }

  static async createRoomForAnnouncement(announcementId: number, customerId: number): Promise<IChatRoom> {
    const response = await api.post(`/chat/rooms/announcement/${announcementId}`, { customerId });
    return response.data;
  }

  static async getRooms(): Promise<IChatRoom[]> {
    const response = await api.get('/chat/rooms');
    return response.data;
  }

  static async getManagerRooms(): Promise<IChatRoom[]> {
    const response = await api.get('/chat/manager/rooms');
    return response.data;
  }

  static async getRoomById(id: number): Promise<IChatRoom> {
    const response = await api.get(`/chat/rooms/${id}`);
    return response.data;
  }

  static async getRoomByDealId(dealId: number): Promise<IChatRoom> {
    const response = await api.get(`/chat/rooms/deal/${dealId}`);
    return response.data;
  }

  static async createMessage(roomId: number, data: CreateChatMessageDto): Promise<IChatMessage> {
    const response = await api.post(`/chat/rooms/${roomId}/messages`, data);
    return response.data;
  }

  static async getMessages(roomId: number, page?: number, limit?: number): Promise<IChatMessage[]> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    
    const response = await api.get(`/chat/rooms/${roomId}/messages`, { params });
    return response.data;
  }

  static async markAsRead(messageId: number, data: MarkAsReadDto): Promise<IChatMessage> {
    const response = await api.patch(`/chat/messages/${messageId}/read`, data);
    return response.data;
  }

  static async markAllAsRead(roomId: number): Promise<void> {
    await api.patch(`/chat/rooms/${roomId}/read-all`);
  }

  static async getUnreadCount(): Promise<number> {
    const response = await api.get('/chat/unread-count');
    return response.data;
  }

  static async assignManagerToRoom(roomId: number): Promise<IChatRoom> {
    const response = await api.patch(`/chat/rooms/${roomId}/assign-manager`);
    return response.data;
  }
}
