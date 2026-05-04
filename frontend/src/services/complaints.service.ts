import { axiosClassic } from '@/api/axios'

export interface IComplaintCreate {
  targetId: number
  dealId?: number
  reason: string
  description: string
  evidence?: string[]
}

export interface IComplaintResolve {
  resolution: string
  action: 'WARNING' | 'TEMPORARY_BAN' | 'PERMANENT_BAN' | 'ORDER_CANCELLED' | 'NO_ACTION'
}

export const complaintsService = {
  async getAll() {
    const { data } = await axiosClassic.get('/complaints')
    return data
  },

  async getOne(id: number) {
    const { data } = await axiosClassic.get(`/complaints/${id}`)
    return data
  },

  async getMy() {
    const { data } = await axiosClassic.get('/complaints/my')
    return data
  },

  async getPending() {
    const { data } = await axiosClassic.get('/complaints/pending')
    return data
  },

  async create(dto: IComplaintCreate) {
    const { data } = await axiosClassic.post('/complaints', dto)
    return data
  },

  async assignToMe(id: number) {
    const { data } = await axiosClassic.patch(`/complaints/${id}/assign`)
    return data
  },

  async resolve(id: number, dto: IComplaintResolve) {
    const { data } = await axiosClassic.patch(`/complaints/${id}/resolve`, dto)
    return data
  },

  async reject(id: number, reason: string) {
    const { data } = await axiosClassic.patch(`/complaints/${id}/reject`, { reason })
    return data
  }
}

