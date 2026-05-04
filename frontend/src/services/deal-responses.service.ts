import { api } from '@/api/axios';
import { withRetry } from '@/utils/api-retry';

export interface DealResponse {
  id: number;
  dealId: number;
  executorId: number;
  message: string;
  proposedPrice?: number;
  estimatedDays?: number;
  portfolioLinks?: string[];
  experience?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  executor?: {
    id: number;
    fullName?: string;
    login: string;
    avatar?: string;
    profile?: {
      rating: number;
      totalReviews: number;
      completedDeals: number;
      specializations: string[];
      experience?: number;
    };
  };
  deal?: {
    id: number;
    title: string;
    description: string;
    category: string;
    budget?: number;
    deadline?: string;
    location?: string;
    status: string;
    customer?: {
      id: number;
      fullName?: string;
      login: string;
      avatar?: string;
    };
  };
}

export interface CreateDealResponseDto {
  dealId: number;
  message: string;
  proposedPrice?: number;
  estimatedDays?: number;
  portfolioLinks?: string[];
  experience?: string;
}

export interface RejectResponseDto {
  rejectionReason?: string;
}

export class DealResponsesService {
  // Create response (executor)
  static async createResponse(dto: CreateDealResponseDto): Promise<DealResponse> {
    return withRetry(
      async () => {
        const response = await api.post('/deal-responses', dto);
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  // Get executor's responses
  static async getMyResponses(): Promise<DealResponse[]> {
    return withRetry(
      async () => {
        const response = await api.get('/deal-responses/my');
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  // Get responses for a deal (customer)
  static async getDealResponses(dealId: number): Promise<DealResponse[]> {
    return withRetry(
      async () => {
        const response = await api.get(`/deal-responses/deal/${dealId}`);
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  // Accept response (customer)
  static async acceptResponse(responseId: number): Promise<DealResponse> {
    return withRetry(
      async () => {
        const response = await api.patch(`/deal-responses/${responseId}/accept`);
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  // Reject response (customer)
  static async rejectResponse(
    responseId: number,
    dto: RejectResponseDto
  ): Promise<DealResponse> {
    return withRetry(
      async () => {
        const response = await api.patch(`/deal-responses/${responseId}/reject`, dto);
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }

  // Withdraw response (executor)
  static async withdrawResponse(responseId: number): Promise<{ message: string }> {
    return withRetry(
      async () => {
        const response = await api.delete(`/deal-responses/${responseId}`);
        return response.data;
      },
      { maxRetries: 2, retryDelay: 1000 }
    );
  }
}

