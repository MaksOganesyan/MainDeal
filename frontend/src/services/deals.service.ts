import { api } from '@/api/axios';
import { IDeal, DealStatus } from '@/types/detail-deal.types';
import { withRetry, handleApiError, safeApiCall } from '@/utils/api-retry';

export interface CreateDealDto {
  title: string;
  description: string;
  category: string;
  materials?: string[];
  specifications?: string;
  drawings?: string[];
  budget?: number;
  currency?: string;
  deadline?: string;
  estimatedTime?: number;
  location?: string;
  isUrgent?: boolean;
  attachments?: string[];
}

export interface UpdateDealDto extends Partial<CreateDealDto> {
  price?: number;
  status?: DealStatus;
}

export interface AssignExecutorDto {
  executorId: number;
  price?: number;
}

export interface DealStats {
  total: number;
  active: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  dispute: number;
  totalSpent?: number;
  totalEarned?: number;
  averagePrice: number;
  reviewsGiven?: number;
  reviewsReceived?: number;
  averageRating?: number;
}

export interface DealHistory {
  deals: any[];
  stats: DealStats;
}

export interface PriceCalculation {
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  marketAverage: number;
  calculatedBase: number;
  breakdown: {
    basePrice: number;
    complexityMultiplier: number;
    materialsCount: number;
    estimatedTime?: number;
    isUrgent?: boolean;
    samplesCount: number;
  };
}

export class DealsService {
  static async createDeal(data: CreateDealDto): Promise<IDeal> {
    const response = await api.post('/deals', data);
    return response.data;
  }

  static async getDeals(category?: string): Promise<IDeal[]> {
    const params = category ? { category } : {};
    const response = await api.get('/deals', { params });
    return response.data;
  }

  static async getMyDeals(): Promise<IDeal[]> {
    const response = await api.get('/deals/my');
    return response.data;
  }

  static async getExecutorDeals(): Promise<IDeal[]> {
    const response = await api.get('/deals/executor');
    return response.data;
  }

  static async getDeal(id: number): Promise<IDeal> {
    const response = await api.get(`/deals/${id}`);
    return response.data;
  }

  static async updateDeal(id: number, data: UpdateDealDto): Promise<IDeal> {
    const response = await api.patch(`/deals/${id}`, data);
    return response.data;
  }

  static async assignExecutor(id: number, data: AssignExecutorDto): Promise<IDeal> {
    const response = await api.post(`/deals/${id}/assign-executor`, data);
    return response.data;
  }

  static async completeDeal(id: number): Promise<IDeal> {
    const response = await api.post(`/deals/${id}/complete`);
    return response.data;
  }

  static async deleteDeal(id: number): Promise<void> {
    await api.delete(`/deals/${id}`);
  }

  static async getCustomerHistory(): Promise<DealHistory> {
    return withRetry(
      async () => {
        const response = await api.get('/deals/history/customer');
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  static async getExecutorHistory(): Promise<DealHistory> {
    return withRetry(
      async () => {
        const response = await api.get('/deals/history/executor');
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  static async calculatePrice(params: {
    category: string;
    complexity?: 'low' | 'medium' | 'high';
    materials?: string[];
    estimatedTime?: number;
    isUrgent?: boolean;
    location?: string;
  }): Promise<PriceCalculation> {
    try {
      return await withRetry(
        async () => {
          const response = await api.post('/deals/calculate-price', params);
          return response.data;
        },
        { maxRetries: 2, retryDelay: 1000 }
      );
    } catch (error) {
      console.error('Failed to calculate price:', error);
      throw new Error(handleApiError(error));
    }
  }

  static async searchDealsByCategory(category: string): Promise<IDeal[]> {
    const response = await api.get('/deals', { params: { category } });
    return response.data;
  }
}

// Export instance for convenience
export const dealsService = {
  getAll: DealsService.getDeals,
  getOne: DealsService.getDeal,
  getMy: DealsService.getMyDeals,
  getExecutor: DealsService.getExecutorDeals,
  create: DealsService.createDeal,
  update: DealsService.updateDeal,
  delete: DealsService.deleteDeal,
  assignExecutor: DealsService.assignExecutor,
  complete: DealsService.completeDeal,
  searchByCategory: DealsService.searchDealsByCategory,
};
