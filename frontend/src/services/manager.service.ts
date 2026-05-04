import { axiosClassic } from '@/api/axios'

export const managerService = {
  // Dashboard
  async getDashboardStats() {
    const { data } = await axiosClassic.get('/manager/dashboard/stats')
    return data
  },

  // Chats
  async getAllChats() {
    const { data } = await axiosClassic.get('/manager/chats')
    return data
  },

  async getActiveChats() {
    const { data } = await axiosClassic.get('/manager/chats/active')
    return data
  },

  async getChatDetails(id: number) {
    const { data } = await axiosClassic.get(`/manager/chats/${id}`)
    return data
  },

  async assignChat(id: number) {
    const { data } = await axiosClassic.patch(`/manager/chats/${id}/assign`)
    return data
  },

  async closeChat(id: number) {
    const { data } = await axiosClassic.patch(`/manager/chats/${id}/close`)
    return data
  },

  // Users
  async getAllUsers() {
    const { data } = await axiosClassic.get('/manager/users')
    return data
  },

  async getCustomers() {
    const { data } = await axiosClassic.get('/manager/users/customers')
    return data
  },

  async getExecutors() {
    const { data } = await axiosClassic.get('/manager/users/executors')
    return data
  },

  async getUserDetails(id: number) {
    const { data } = await axiosClassic.get(`/manager/users/${id}`)
    return data
  },

  async blockUser(id: number, reason: string) {
    const { data } = await axiosClassic.patch(`/manager/users/${id}/block`, { reason })
    return data
  },

  async unblockUser(id: number) {
    const { data } = await axiosClassic.patch(`/manager/users/${id}/unblock`)
    return data
  },

  // Deals
  async getAllDeals() {
    const { data } = await axiosClassic.get('/manager/deals')
    return data
  },

  async getActiveDeals() {
    const { data } = await axiosClassic.get('/manager/deals/active')
    return data
  },

  async getInProgressDeals() {
    const { data } = await axiosClassic.get('/manager/deals/in-progress')
    return data
  },

  async getDisputeDeals() {
    const { data } = await axiosClassic.get('/manager/deals/disputes')
    return data
  },

  async getDealDetails(id: number) {
    const { data } = await axiosClassic.get(`/manager/deals/${id}`)
    return data
  },

  async updateDealStatus(id: number, status: string, reason?: string) {
    const { data } = await axiosClassic.patch(`/manager/deals/${id}/status`, { status, reason })
    return data
  },

  // Announcements
  async getAllAnnouncements() {
    const { data } = await axiosClassic.get('/manager/announcements')
    return data
  },

  async hideAnnouncement(id: number) {
    const { data } = await axiosClassic.patch(`/manager/announcements/${id}/hide`)
    return data
  },

  async showAnnouncement(id: number) {
    const { data } = await axiosClassic.patch(`/manager/announcements/${id}/show`)
    return data
  },

  // Complaints
  async getAllComplaints() {
    const { data } = await axiosClassic.get('/manager/complaints')
    return data
  },

  async getPendingComplaints() {
    const { data } = await axiosClassic.get('/manager/complaints/pending')
    return data
  },

  async getComplaintDetails(id: number) {
    const { data } = await axiosClassic.get(`/manager/complaints/${id}`)
    return data
  },

  // Activity Log
  async getActivityLog() {
    const { data } = await axiosClassic.get('/manager/activity-log')
    return data
  }
}

