import { api } from '@/api/axios';
import { IProfile, IEquipment, IPortfolioItem } from '@/types/detail-deal.types';

export interface CreateProfileDto {
  companyName?: string;
  specializations?: string[];
  experience?: number;
  description?: string;
  website?: string;
  isPublic?: boolean;
  showContactInfo?: boolean;
}

export interface UpdateProfileDto extends Partial<CreateProfileDto> {}

export interface CreateEquipmentDto {
  name: string;
  type: string;
  model?: string;
  year?: number;
  description?: string;
  images?: string[];
}

export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {}

export interface CreatePortfolioItemDto {
  title: string;
  description?: string;
  images?: string[];
  category?: string;
  materials?: string[];
}

export interface UpdatePortfolioItemDto extends Partial<CreatePortfolioItemDto> {}

export class ProfilesService {
  static async createProfile(data: CreateProfileDto): Promise<IProfile> {
    const response = await api.post('/profiles', data);
    return response.data;
  }

  static async getProfiles(specialization?: string): Promise<IProfile[]> {
    const params = specialization ? { specialization } : {};
    const response = await api.get('/profiles', { params });
    return response.data;
  }

  static async getTopExecutors(limit?: number): Promise<IProfile[]> {
    const params = limit ? { limit } : {};
    const response = await api.get('/profiles/top', { params });
    return response.data;
  }

  static async getProfile(id: number): Promise<IProfile> {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  }

  static async getProfileByUserId(userId: number): Promise<IProfile> {
    const response = await api.get(`/profiles/user/${userId}`);
    return response.data;
  }

  static async updateProfile(id: number, data: UpdateProfileDto): Promise<IProfile> {
    const response = await api.patch(`/profiles/${id}`, data);
    return response.data;
  }

  static async deleteProfile(id: number): Promise<void> {
    await api.delete(`/profiles/${id}`);
  }

  // Equipment methods
  static async createEquipment(profileId: number, data: CreateEquipmentDto): Promise<IEquipment> {
    const response = await api.post(`/equipment/${profileId}`, data);
    return response.data;
  }

  static async getEquipmentByProfile(profileId: number): Promise<IEquipment[]> {
    const response = await api.get(`/equipment/profile/${profileId}`);
    return response.data;
  }

  static async searchEquipmentByType(type: string): Promise<IEquipment[]> {
    const response = await api.get('/equipment/search', { params: { type } });
    return response.data;
  }

  static async getEquipment(id: number): Promise<IEquipment> {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  }

  static async updateEquipment(id: number, data: UpdateEquipmentDto): Promise<IEquipment> {
    const response = await api.patch(`/equipment/${id}`, data);
    return response.data;
  }

  static async deleteEquipment(id: number): Promise<void> {
    await api.delete(`/equipment/${id}`);
  }

  // Portfolio methods
  static async createPortfolioItem(profileId: number, data: CreatePortfolioItemDto): Promise<IPortfolioItem> {
    const response = await api.post(`/portfolio/${profileId}`, data);
    return response.data;
  }

  static async getPortfolioByProfile(profileId: number): Promise<IPortfolioItem[]> {
    const response = await api.get(`/portfolio/profile/${profileId}`);
    return response.data;
  }

  static async searchPortfolioByCategory(category: string): Promise<IPortfolioItem[]> {
    const response = await api.get('/portfolio/search/category', { params: { category } });
    return response.data;
  }

  static async searchPortfolioByMaterials(materials: string[]): Promise<IPortfolioItem[]> {
    const response = await api.get('/portfolio/search/materials', { 
      params: { materials: materials.join(',') } 
    });
    return response.data;
  }

  static async getPortfolioItem(id: number): Promise<IPortfolioItem> {
    const response = await api.get(`/portfolio/${id}`);
    return response.data;
  }

  static async updatePortfolioItem(id: number, data: UpdatePortfolioItemDto): Promise<IPortfolioItem> {
    const response = await api.patch(`/portfolio/${id}`, data);
    return response.data;
  }

  static async deletePortfolioItem(id: number): Promise<void> {
    await api.delete(`/portfolio/${id}`);
  }
}
