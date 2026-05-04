import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ParseIntPipe
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('manager')
@Auth([userrole_role.MANAGER, userrole_role.ADMIN])
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  // ===== DASHBOARD =====
  
  @Get('dashboard/stats')
  getDashboardStats(@Request() req) {
    return this.managerService.getDashboardStats(req.user.id);
  }

  // ===== CHATS MANAGEMENT =====

  @Get('chats')
  getAllChats(@Request() req) {
    return this.managerService.getAllChats(req.user.id);
  }

  @Get('chats/active')
  getActiveChats(@Request() req) {
    return this.managerService.getActiveChats(req.user.id);
  }

  @Get('chats/:id')
  getChatDetails(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.getChatDetails(id);
  }

  @Patch('chats/:id/assign')
  assignChatToMe(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.managerService.assignChat(id, req.user.id);
  }

  @Patch('chats/:id/close')
  closeChat(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.closeChat(id);
  }

  // ===== USERS MANAGEMENT =====

  @Get('users')
  getAllUsers() {
    return this.managerService.getAllUsers();
  }

  @Get('users/customers')
  getCustomers() {
    return this.managerService.getCustomers();
  }

  @Get('users/executors')
  getExecutors() {
    return this.managerService.getExecutors();
  }

  @Get('users/:id')
  getUserDetails(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.getUserDetails(id);
  }

  @Patch('users/:id/block')
  blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Request() req
  ) {
    return this.managerService.blockUser(id, reason, req.user.id);
  }

  @Patch('users/:id/unblock')
  unblockUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.managerService.unblockUser(id, req.user.id);
  }

  // ===== DEALS MANAGEMENT =====

  @Get('deals')
  getAllDeals() {
    return this.managerService.getAllDeals();
  }

  @Get('deals/active')
  getActiveDeals() {
    return this.managerService.getActiveDeals();
  }

  @Get('deals/in-progress')
  getInProgressDeals() {
    return this.managerService.getInProgressDeals();
  }

  @Get('deals/disputes')
  getDisputeDeals() {
    return this.managerService.getDisputeDeals();
  }

  @Get('deals/:id')
  getDealDetails(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.getDealDetails(id);
  }

  @Patch('deals/:id/status')
  updateDealStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @Body('reason') reason?: string
  ) {
    return this.managerService.updateDealStatus(id, status, reason);
  }

  // ===== ANNOUNCEMENTS MANAGEMENT =====

  @Get('announcements')
  getAllAnnouncements() {
    return this.managerService.getAllAnnouncements();
  }

  @Patch('announcements/:id/hide')
  hideAnnouncement(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.hideAnnouncement(id);
  }

  @Patch('announcements/:id/show')
  showAnnouncement(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.showAnnouncement(id);
  }

  // ===== COMPLAINTS MANAGEMENT =====

  @Get('complaints')
  getAllComplaints() {
    return this.managerService.getAllComplaints();
  }

  @Get('complaints/pending')
  getPendingComplaints() {
    return this.managerService.getPendingComplaints();
  }

  @Get('complaints/:id')
  getComplaintDetails(@Param('id', ParseIntPipe) id: number) {
    return this.managerService.getComplaintDetails(id);
  }

  // ===== ACTIVITY LOG =====

  @Get('activity-log')
  getActivityLog() {
    return this.managerService.getActivityLog();
  }
}
