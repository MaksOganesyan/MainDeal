import { UserRole } from '@/services/auth/auth.types';

export interface IProfile {
  id: number;
  userId: number;
  companyName?: string;
  specializations: string[];
  experience?: number;
  description?: string;
  website?: string;
  isPublic: boolean;
  showContactInfo: boolean;
  rating: number;
  totalReviews: number;
  completedDeals: number;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  equipment?: IEquipment[];
  portfolio?: IPortfolioItem[];
}

export interface IEquipment {
  id: number;
  profileId: number;
  name: string;
  type: string;
  model?: string;
  year?: number;
  description?: string;
  images: string[];
  createdAt: string;
}

export interface IPortfolioItem {
  id: number;
  profileId: number;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  materials: string[];
  createdAt: string;
}

export interface IDeal {
  id: number;
  customerId: number;
  executorId?: number;
  title: string;
  description: string;
  category: string;
  materials: string[];
  specifications?: string;
  drawings: string[];
  budget?: number;
  price?: number;
  currency: string;
  deadline?: string;
  estimatedTime?: number;
  status: DealStatus;
  location?: string;
  isUrgent: boolean;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  customer?: IUser;
  executor?: IUser;
  chatRoom?: IChatRoom;
  reviews?: IReview[];
}

export enum DealStatus {
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTE = 'DISPUTE'
}

export interface IChatRoom {
  id: number;
  dealId?: number;
  announcementId?: number;
  managerId?: number;
  members: IUser[];
  manager?: IUser;
  messages: IChatMessage[];
  deal?: {
    id: number;
    title: string;
    status: string;
    customerId?: number;
  };
  announcement?: {
    id: number;
    title: string;
    executorId?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IChatMessage {
  id: number;
  roomId: number;
  authorId: number;
  recipientId?: number | null;
  content: string;
  type: MessageType;
  attachments: string[];
  isRead: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  createdAt: string;
  author?: IUser;
  recipient?: IUser;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
  AUTO_REPLY = 'AUTO_REPLY'
}

export interface IReview {
  id: number;
  dealId: number;
  authorId: number;
  targetId: number;
  rating: number;
  comment?: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  author?: IUser;
  target?: IUser;
}

export interface IUser {
  id: number;
  login: string;
  roles: UserRole[];
  fullName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  address?: string;
  registeredAt: string;
  isActive: boolean;
}
