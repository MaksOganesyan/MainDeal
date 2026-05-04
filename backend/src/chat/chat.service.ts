import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChatMessageDto, CreateChatRoomDto, MarkAsReadDto } from './dto/create-chat.dto';
import { MessageType } from '@prisma/client'
import { userrole_role, userrole } from '@prisma/client'
import { ContentFilterService } from '../utils/content-filter.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface UserWithRoles {
  id: number;
  login: string;
  email: string;
  userrole: userrole[];
}

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private contentFilter: ContentFilterService,
    private notificationsService: NotificationsService
  ) {}

  async createRoom(dealId: number, userId: number, createChatRoomDto: CreateChatRoomDto) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
      include: { customer: true }
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const existingRoom = await this.prisma.chatRoom.findUnique({
      where: { dealId },
      include: { chatRoomMembers: { select: { id: true } } }
    });

    if (existingRoom) {
      const isMember = existingRoom.chatRoomMembers.some(m => m.id === userId);
      if (!isMember) {
        await this.prisma.chatRoom.update({
          where: { id: existingRoom.id },
          data: { chatRoomMembers: { connect: { id: userId } } }
        });
      }

      return this.prisma.chatRoom.findUnique({
        where: { id: existingRoom.id },
        include: {
          chatRoomMembers: { 
            include: {
              user: { select: { id: true, login: true, fullName: true, avatar: true } }
            }
          },
          manager: { select: { id: true, login: true, fullName: true } },
          deal: { select: { id: true, title: true, status: true } }
        }
      });
    }

    const manager = await this.findAvailableManager();
    if (!manager) {
      throw new NotFoundException('No available manager found');
    }

    const memberIds = [deal.customerId, userId, manager.id];
    const room = await this.prisma.chatRoom.create({
      data: {
        dealId,
        managerId: manager.id,
        chatRoomMembers: { connect: [...new Set(memberIds)].map(id => ({ id })) }
      },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true } }
          }
        },
        manager: { select: { id: true, login: true, fullName: true } },
        deal: { select: { id: true, title: true, status: true } }
      }
    });

    await this.sendAutoReply(room.id);

    await this.notificationsService.create({
      userId: manager.id,
      type: 'NEW_MESSAGE',
      title: 'Новый чат',
      message: `Создан новый чат по заказу "${deal.title}"`,
      relatedId: room.id,
      link: `/manager/chats/${room.id}`
    });

    return room;
  }

  async createRoomForAnnouncement(announcementId: number, customerId: number) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
      include: { executor: true }
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    if (!announcement.isActive || announcement.isHidden) {
      throw new ForbiddenException('Announcement is not available');
    }

    const existingRoom = await this.prisma.chatRoom.findFirst({
      where: {
        announcementId,
        chatRoomMembers: { some: { id: customerId } }
      }
    });

    if (existingRoom) {
      return existingRoom;
    }

    const manager = await this.findAvailableManager();
    const room = await this.prisma.chatRoom.create({
      data: {
        announcementId,
        managerId: manager?.id,
        chatRoomMembers: { connect: [{ id: customerId }, { id: announcement.executorId }] }
      },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true } }
          }
        },
        manager: { select: { id: true, login: true, fullName: true } },
        announcement: { select: { id: true, title: true } }
      }
    });

    await this.sendAutoReply(room.id);

    if (manager) {
      await this.notificationsService.create({
        userId: manager.id,
        type: 'NEW_MESSAGE',
        title: 'Новый чат',
        message: `Создан новый чат по объявлению "${announcement.title}"`,
        relatedId: room.id,
        link: `/manager/chats/${room.id}`
      });
    }

    await this.notificationsService.create({
      userId: announcement.executorId,
      type: 'NEW_MESSAGE',
      title: 'Интерес к вашему объявлению',
      message: `Клиент заинтересовался вашим объявлением "${announcement.title}"`,
      relatedId: room.id,
      link: `/chats/${room.id}`
    });

    return room;
  }

  private async findAvailableManager() {
    const managers = await this.prisma.user.findMany({
      where: {
        userrole: { some: { role: userrole_role.MANAGER } },
        isActive: true,
        isBlocked: false
      }
    });
    if (managers.length === 0) {
      return null;
    }
    return managers[0];
  }

  private async sendAutoReply(roomId: number) {
    const autoReplyMessage =
      'Здравствуйте! Менеджер скоро подключится к беседе. ' +
      'Опишите дополнительные пожелания, если есть. ' +
      'Обращаем внимание, что запрещено передавать контактные данные в чате.';

    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      select: { managerId: true }
    });

    if (!room?.managerId) {
      return;
    }

    await this.prisma.chatMessage.create({
      data: {
        roomId,
        authorId: room.managerId,
        recipientId: null,
        content: autoReplyMessage,
        type: MessageType.AUTO_REPLY
      }
    });
  }

  async findAllRooms(userId: number) {
    return this.prisma.chatRoom.findMany({
      where: { chatRoomMembers: { some: { id: userId } } },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true, userrole: { select: { role: true } } } }
          }
        },
        manager: { select: { id: true, login: true, fullName: true, avatar: true } },
        deal: { select: { id: true, title: true, status: true } },
        announcement: { select: { id: true, title: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, login: true, fullName: true, avatar: true } } }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async assignManagerToRoom(roomId: number, managerId: number) {
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
      include: { userrole: { select: { role: true } } }
    });

    if (!manager) {
      throw new ForbiddenException('User not found');
    }

    const managerRoles = manager.userrole.map(r => r.role);
    if (!managerRoles.includes(userrole_role.MANAGER)) {
      throw new ForbiddenException('Access denied. Manager role required.');
    }

    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { 
        chatRoomMembers: { 
          include: {
            user: { select: { id: true } }
          }
        }
      }
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    const updatedRoom = await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        managerId,
        chatRoomMembers: {
          connect: room.chatRoomMembers.some(m => m.user.id === managerId) ? [] : [{ id: managerId }]
        }
      },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true, userrole: { select: { role: true } } } }
          }
        },
        manager: { select: { id: true, login: true, fullName: true, avatar: true } },
        deal: { select: { id: true, title: true, status: true } },
        announcement: { select: { id: true, title: true } }
      }
    });

    const memberIds = room.chatRoomMembers.map(m => m.user.id).filter(id => id !== managerId);
    for (const memberId of memberIds) {
      await this.notificationsService.create({
        userId: memberId,
        type: 'SYSTEM',
        title: 'Менеджер назначен',
        message: `Менеджер ${manager.fullName || manager.login} назначен на ваш чат`,
        relatedId: roomId,
        link: `/chats/${roomId}`
      });
    }

    return updatedRoom;
  }

  async findAllRoomsForManager(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userrole: { select: { role: true } } }
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const userRoles = user.userrole.map(r => r.role);
    if (!userRoles.includes(userrole_role.MANAGER)) {
      throw new ForbiddenException('Access denied. Manager role required.');
    }

    return this.prisma.chatRoom.findMany({
      where: { isActive: true },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true, userrole: { select: { role: true } } } }
          }
        },
        manager: { select: { id: true, login: true, fullName: true, avatar: true } },
        deal: { select: { id: true, title: true, status: true, customer: { select: { id: true, login: true, fullName: true } } } },
        announcement: { select: { id: true, title: true, executor: { select: { id: true, login: true, fullName: true } } } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, login: true, fullName: true, avatar: true } } }
        },
        _count: { select: { messages: { where: { isRead: false } } } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findRoomById(roomId: number, userId: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true, userrole: { select: { role: true } } } }
          }
        },
        deal: { select: { id: true, title: true, status: true, customerId: true } },
        announcement: { select: { id: true, title: true, executorId: true } },
        manager: { select: { id: true, login: true, fullName: true } },
        messages: {
          include: { author: { select: { id: true, login: true, fullName: true, avatar: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userrole: { select: { role: true } } }
    });

    const hasManagerRole = user?.userrole.some(r => r.role === userrole_role.MANAGER) || 
                          user?.userrole.some(r => r.role === userrole_role.ADMIN);

    const isMember = room.chatRoomMembers.some(member => member.user.id === userId);
    const isDealOwner = room.deal?.customerId === userId;
    const isAnnouncementExecutor = room.announcement?.executorId === userId;
    const isAssignedManager = room.managerId === userId;

    if (!isMember && !isDealOwner && !isAnnouncementExecutor && !isAssignedManager && !hasManagerRole) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    if ((hasManagerRole || isDealOwner || isAnnouncementExecutor) && !isMember) {
      await this.prisma.chatRoom.update({
        where: { id: roomId },
        data: { chatRoomMembers: { connect: { id: userId } } }
      });
    }

    return room;
  }

  async findRoomByDealId(dealId: number, userId: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { dealId },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true, login: true, fullName: true, avatar: true } }
          }
        },
        deal: { select: { id: true, title: true, status: true, customerId: true } },
        manager: { select: { id: true, login: true, fullName: true } },
        messages: {
          include: { author: { select: { id: true, login: true, fullName: true, avatar: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    const isMember = room.chatRoomMembers.some(member => member.user.id === userId);
    const isDealOwner = room.deal?.customerId === userId;
    const isManager = room.managerId === userId;

    if (!isMember && !isDealOwner && !isManager) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    if (!isMember && (isDealOwner || isManager)) {
      await this.prisma.chatRoom.update({
        where: { id: room.id },
        data: { chatRoomMembers: { connect: { id: userId } } }
      });
    }

    return room;
  }

  async createMessage(roomId: number, authorId: number, createChatMessageDto: CreateChatMessageDto) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        chatRoomMembers: true,
        manager: true,
        deal: { select: { customerId: true } },
        announcement: { select: { executorId: true } }
      }
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    const isMember = room.chatRoomMembers.some(member => member.id === authorId);
    const isAssignedManager = room.manager?.id === authorId;

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      include: { userrole: { select: { role: true } } }
    });

    const hasManagerRole = author?.userrole.some(r => r.role === userrole_role.MANAGER) || 
                          author?.userrole.some(r => r.role === userrole_role.ADMIN);

    if (!isMember && !isAssignedManager && !hasManagerRole) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    let recipientId: number | null = null;
    if (hasManagerRole) {
      if (!createChatMessageDto.recipientId) {
        throw new BadRequestException('Manager must specify recipientId (customer or executor)');
      }

      const isRecipientMember = room.chatRoomMembers.some(m => m.id === createChatMessageDto.recipientId);
      const isRecipientCustomer = room.deal?.customerId === createChatMessageDto.recipientId;
      const isRecipientExecutor = room.announcement?.executorId === createChatMessageDto.recipientId;

      if (!isRecipientMember && !isRecipientCustomer && !isRecipientExecutor) {
        throw new BadRequestException('Invalid recipientId: user is not part of this chat');
      }
      recipientId = createChatMessageDto.recipientId;
    } else {
      recipientId = null;
    }

    let isBlocked = false;
    let blockReason: string | undefined;
    if (!hasManagerRole && createChatMessageDto.type === MessageType.TEXT) {
      const filterResult = this.contentFilter.checkContent(createChatMessageDto.content);
      if (filterResult.isBlocked) {
        isBlocked = true;
        blockReason = filterResult.reason;
        throw new BadRequestException({
          message: this.contentFilter.getWarningMessage(),
          reason: filterResult.reason,
          blockedPatterns: filterResult.blockedPatterns
        });
      }
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        roomId,
        authorId,
        recipientId,
        content: createChatMessageDto.content,
        type: createChatMessageDto.type || MessageType.TEXT,
        attachments: createChatMessageDto.attachments ? JSON.stringify(createChatMessageDto.attachments) : null,
        isBlocked,
        blockReason
      },
      include: {
        author: { select: { id: true, login: true, fullName: true, avatar: true, userrole: { select: { role: true } } } },
        recipient: { select: { id: true, login: true, fullName: true, userrole: { select: { role: true } } } }
      }
    });

    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    const notificationRecipientIds: number[] = [];
    if (hasManagerRole && recipientId) {
      notificationRecipientIds.push(recipientId);
    } else {
      if (room.manager && room.manager.id !== authorId) {
        notificationRecipientIds.push(room.manager.id);
      }
    }

    for (const notifRecipientId of notificationRecipientIds) {
      await this.notificationsService.create({
        userId: notifRecipientId,
        type: 'NEW_MESSAGE',
        title: 'Новое сообщение',
        message: `${message.author.fullName || message.author.login}: ${message.content.substring(0, 50)}...`,
        relatedId: roomId,
        link: `/chats/${roomId}`
      });
    }

    return message;
  }

  async getMessages(roomId: number, userId: number, page: number = 1, limit: number = 50) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        chatRoomMembers: { 
          include: {
            user: { select: { id: true } }
          }
        },
        deal: { select: { customerId: true } },
        announcement: { select: { executorId: true } }
      }
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userrole: { select: { role: true } } }
    });

    const hasManagerRole = user?.userrole.some(r => r.role === userrole_role.MANAGER) || 
                          user?.userrole.some(r => r.role === userrole_role.ADMIN);

    const isMember = room.chatRoomMembers.some(member => member.user.id === userId);
    const isDealOwner = room.deal?.customerId === userId;
    const isAnnouncementExecutor = room.announcement?.executorId === userId;
    const isAssignedManager = room.managerId === userId;

    if (!isMember && !isDealOwner && !isAnnouncementExecutor && !isAssignedManager && !hasManagerRole) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    const skip = (page - 1) * limit;
    const whereClause: any = { roomId };

    if (!hasManagerRole) {
      whereClause.OR = [
        { authorId: userId },
        { recipientId: userId },
        { type: MessageType.AUTO_REPLY, recipientId: null }
      ];
    }

    return this.prisma.chatMessage.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, login: true, fullName: true, avatar: true, userrole: { select: { role: true } } } },
        recipient: { select: { id: true, login: true, fullName: true, userrole: { select: { role: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
  }

  async markAsRead(messageId: number, userId: number) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { room: { include: { chatRoomMembers: true } } }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const isMember = message.room.chatRoomMembers.some(member => member.id === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    return this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(roomId: number, userId: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { 
        chatRoomMembers: { 
          include: {
            user: { select: { id: true } }
          }
        }
      }
    });

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    const isMember = room.chatRoomMembers.some(member => member.user.id === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    return this.prisma.chatMessage.updateMany({
      where: { roomId, authorId: { not: userId }, isRead: false },
      data: { isRead: true }
    });
  }

  async getUnreadCount(userId: number) {
    const rooms = await this.prisma.chatRoom.findMany({
      where: { chatRoomMembers: { some: { id: userId } } },
      include: {
        messages: {
          where: { authorId: { not: userId }, isRead: false }
        }
      }
    });

    return rooms.reduce((total, room) => total + room.messages.length, 0);
  }
}
