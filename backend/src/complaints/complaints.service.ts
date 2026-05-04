import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateComplaintDto, UpdateComplaintDto, ResolveComplaintDto } from './dto/create-complaint.dto';
import { ComplaintStatus, ComplaintAction } from '@prisma/client'
import { userrole_role, userrole } from '@prisma/client'
import { NotificationsService } from '../notifications/notifications.service';

export interface UserWithRoles {
  id: number;
  login: string;
  email: string;
  userrole: userrole[];
}

@Injectable()
export class ComplaintsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(authorId: number, createComplaintDto: CreateComplaintDto) {
    const complaint = await this.prisma.complaint.create({
      data: {
        authorId,
        ...createComplaintDto,
        evidence: createComplaintDto.evidence ? JSON.stringify(createComplaintDto.evidence) : null
      },
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } },
        deal: { select: { id: true, title: true } }
      }
    });

    const managers = await this.prisma.user.findMany({
      where: { userrole: { some: { role: userrole_role.MANAGER } } }
    });

    for (const manager of managers) {
      await this.notificationsService.create({
        userId: manager.id,
        type: 'COMPLAINT_CREATED',
        title: 'Новая жалоба',
        message: `Пользователь ${complaint.author.fullName || complaint.author.login} подал жалобу`,
        relatedId: complaint.id,
        link: `/manager/complaints/${complaint.id}`
      });
    }

    return complaint;
  }

  async findAll(managerId?: number) {
    return this.prisma.complaint.findMany({
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } },
        deal: { select: { id: true, title: true } },
        handler: { select: { id: true, login: true, fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, login: true, fullName: true, email: true } },
        target: { select: { id: true, login: true, fullName: true, email: true } },
        deal: {
          include: {
            chatRoom: {
              include: {
                messages: {
                  include: { author: { select: { id: true, login: true, fullName: true } } },
                  orderBy: { createdAt: 'asc' }
                }
              }
            }
          }
        },
        handler: { select: { id: true, login: true, fullName: true } }
      }
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }

  async findByUser(userId: number) {
    return this.prisma.complaint.findMany({
      where: { OR: [{ authorId: userId }, { targetId: userId }] },
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } },
        deal: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findPending() {
    return this.prisma.complaint.findMany({
      where: { status: ComplaintStatus.PENDING },
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } },
        deal: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async assignToManager(id: number, managerId: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
      include: { userrole: { select: { role: true } } }
    });

    if (!manager) {
      throw new ForbiddenException('Manager not found');
    }

    const managerRoles = manager.userrole.map(r => r.role);
    if (!managerRoles.includes(userrole_role.MANAGER)) {
      throw new ForbiddenException('Only managers can handle complaints');
    }

    return this.prisma.complaint.update({
      where: { id },
      data: { handlerId: managerId, status: ComplaintStatus.IN_REVIEW },
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } },
        handler: { select: { id: true, login: true, fullName: true } }
      }
    });
  }

  async resolve(id: number, managerId: number, resolveDto: ResolveComplaintDto) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: { author: true, target: true }
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
      include: { userrole: { select: { role: true } } }
    });

    if (!manager) {
      throw new ForbiddenException('Manager not found');
    }

    const managerRoles = manager.userrole.map(r => r.role);
    if (!managerRoles.includes(userrole_role.MANAGER)) {
      throw new ForbiddenException('Only managers can resolve complaints');
    }

    if (resolveDto.action === ComplaintAction.TEMPORARY_BAN ||
        resolveDto.action === ComplaintAction.PERMANENT_BAN) {
      await this.prisma.user.update({
        where: { id: complaint.targetId },
        data: { isBlocked: true, blockedAt: new Date(), blockReason: resolveDto.resolution }
      });
    }

    if (resolveDto.action === ComplaintAction.ORDER_CANCELLED && complaint.dealId) {
      await this.prisma.deal.update({
        where: { id: complaint.dealId },
        data: { status: 'CANCELLED' }
      });
    }

    const resolvedComplaint = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: ComplaintStatus.RESOLVED,
        resolution: resolveDto.resolution,
        action: resolveDto.action,
        handlerId: managerId,
        resolvedAt: new Date()
      },
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } },
        handler: { select: { id: true, login: true, fullName: true } }
      }
    });

    await this.notificationsService.create({
      userId: complaint.authorId,
      type: 'COMPLAINT_RESOLVED',
      title: 'Жалоба рассмотрена',
      message: `Ваша жалоба была рассмотрена. Решение: ${resolveDto.resolution}`,
      relatedId: id,
      link: `/complaints/${id}`
    });

    await this.notificationsService.create({
      userId: complaint.targetId,
      type: 'COMPLAINT_RESOLVED',
      title: 'Жалоба рассмотрена',
      message: `Жалоба на вас была рассмотрена. Действие: ${resolveDto.action}`,
      relatedId: id,
      link: `/complaints/${id}`
    });

    return resolvedComplaint;
  }

  async reject(id: number, managerId: number, reason: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const rejectedComplaint = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: ComplaintStatus.REJECTED,
        resolution: reason,
        handlerId: managerId,
        resolvedAt: new Date()
      },
      include: {
        author: { select: { id: true, login: true, fullName: true } },
        target: { select: { id: true, login: true, fullName: true } }
      }
    });

    await this.notificationsService.create({
      userId: complaint.authorId,
      type: 'COMPLAINT_RESOLVED',
      title: 'Жалоба отклонена',
      message: `Ваша жалоба была отклонена. Причина: ${reason}`,
      relatedId: id,
      link: `/complaints/${id}`
    });

    return rejectedComplaint;
  }
}
