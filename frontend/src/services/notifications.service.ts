import { axiosClassic } from '@/api/axios'

export const notificationsService = {
  async getAll() {
    const { data } = await axiosClassic.get('/notifications')
    return data
  },

  async getUnread() {
    const { data } = await axiosClassic.get('/notifications/unread')
    return data
  },

  async getUnreadCount() {
    const { data } = await axiosClassic.get('/notifications/unread/count')
    return data
  },

  async markAsRead(id: number) {
    const { data } = await axiosClassic.patch(`/notifications/${id}/read`)
    return data
  },

  async markAllAsRead() {
    const { data } = await axiosClassic.patch('/notifications/read-all')
    return data
  },

  async delete(id: number) {
    const { data } = await axiosClassic.delete(`/notifications/${id}`)
    return data
  },

  async deleteAll() {
    const { data } = await axiosClassic.delete('/notifications')
    return data
  }
}

