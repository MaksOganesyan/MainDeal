import { axiosClassic } from '@/api/axios'

export interface IAnnouncementCreate {
  title: string
  description: string
  category: string
  priceFrom?: number
  priceTo?: number
  currency?: string
  estimatedDays?: number
  region?: string
  location?: string
  images?: string[]
  attachments?: string[]
  isUrgent?: boolean
}

export interface IAnnouncementSearch {
  category?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  isUrgent?: boolean
  search?: string
  sortBy?: 'price' | 'date' | 'views'
  sortOrder?: 'asc' | 'desc'
}

export const announcementsService = {
  async getAll(searchParams?: IAnnouncementSearch) {
    const params = new URLSearchParams()
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const { data } = await axiosClassic.get(`/announcements?${params.toString()}`)
    return data
  },

  async getOne(id: number) {
    const { data } = await axiosClassic.get(`/announcements/${id}`)
    return data
  },

  async getMy() {
    const { data } = await axiosClassic.get('/announcements/my')
    return data
  },

  async getUrgent() {
    const { data } = await axiosClassic.get('/announcements/urgent')
    return data
  },

  async getByCategory(category: string) {
    const { data } = await axiosClassic.get(`/announcements/category/${category}`)
    return data
  },

  async getByRegion(region: string) {
    const { data } = await axiosClassic.get(`/announcements/region/${region}`)
    return data
  },

  async create(dto: IAnnouncementCreate) {
    const { data } = await axiosClassic.post('/announcements', dto)
    return data
  },

  async update(id: number, dto: Partial<IAnnouncementCreate>) {
    const { data } = await axiosClassic.patch(`/announcements/${id}`, dto)
    return data
  },

  async hide(id: number) {
    const { data } = await axiosClassic.patch(`/announcements/${id}/hide`)
    return data
  },

  async show(id: number) {
    const { data } = await axiosClassic.patch(`/announcements/${id}/show`)
    return data
  },

  async delete(id: number) {
    const { data } = await axiosClassic.delete(`/announcements/${id}`)
    return data
  }
}

