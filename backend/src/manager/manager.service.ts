import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DealStatus } from '@prisma/client'
import { userrole_role } from '@prisma/client'

@Injectable()
export class ManagerService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(managerId: number) {
    const [
      totalUsers,
      totalCustomers,
      totalExecutors,
      totalDeals,
      activeDeals,
      totalAnnouncements,
      pendingComplaints,
      activeChats,
      myChats
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { userrole: { some: { role: userrole_role.CUSTOMER } } } }),
      this.prisma.user.count({ where: { userrole: { some: { role: userrole_role.EXECUTOR } } } }),
      this.prisma.deal.count(),
      this.prisma.deal.count({ where: { status: DealStatus.ACTIVE } }),
      this.prisma.announcement.count({ where: { isActive: true } }),
      this.prisma.complaint.count({ where: { status: 'PENDING' } }),
      this.prisma.chatRoom.count({ where: { isActive: true } }),
      this.prisma.chatRoom.count({ where: { managerId, isActive: true } })
    ]);

    return {
      users: { total: totalUsers, customers: totalCustomers, executors: totalExecutors },
      deals: { total: totalDeals, active: activeDeals },
      announcements: { total: totalAnnouncements },
      complaints: { pending: pendingComplaints },
      chats: { active: activeChats, myChats }
    };
  }

  async getAllChats(managerId: number) {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [
          { managerId },
          { managerId: null }
        ]
      },
      include: {
        chatRoomMembers: {
          include: {
            user: {
              select: {
                id: true,
                login: true,
                fullName: true,
                avatar: true,
                userrole: { select: { role: true } }
              }
            }
          }
        },
        manager: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        deal: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        announcement: {
          select: {
            id: true,
            title: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async getActiveChats(managerId: number) {
    return this.prisma.chatRoom.findMany({
      where: {
        managerId,
        isActive: true
      },
      include: {
        chatRoomMembers: {
          include: {
            user: {
              select: {
                id: true,
                login: true,
                fullName: true,
                avatar: true
              }
            }
          }
        },
        deal: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        announcement: {
          select: {
            id: true,
            title: true
          }
        },
        messages: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async getChatDetails(id: number) {
    const chat = await this.prisma.chatRoom.findUnique({
      where: { id },
      include: {
        chatRoomMembers: {
          include: {
            user: {
              select: {
                id: true,
                login: true,
                fullName: true,
                avatar: true,
                email: true,
                phone: true,
                userrole: { select: { role: true } },
                lastOnline: true
              }
            }
          }
        },
        manager: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        deal: {
          include: {
            customer: true,
            executor: true
          }
        },
        announcement: {
          include: {
            executor: true
          }
        },
        messages: {
          include: {
            author: {
              select: {
                id: true,
                login: true,
                fullName: true,
                avatar: true,
                userrole: { select: { role: true } }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async assignChat(chatId: number, managerId: number) {
    return this.prisma.chatRoom.update({
      where: { id: chatId },
      data: { managerId }
    });
  }

  async closeChat(chatId: number) {
    return this.prisma.chatRoom.update({
      where: { id: chatId },
      data: { isActive: false }
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        fullName: true,
        email: true,
        phone: true,
        region: true,
        userrole: { select: { role: true } },
        isActive: true,
        isBlocked: true,
        registeredAt: true,
        lastOnline: true,
        profile: {
          select: {
            rating: true,
            completedDeals: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });
  }

  async getCustomers() {
    return this.prisma.user.findMany({
      where: {
        userrole: {
          some: {
            role: userrole_role.CUSTOMER
          }
        }
      },
      select: {
        id: true,
        login: true,
        fullName: true,
        email: true,
        phone: true,
        region: true,
        isActive: true,
        isBlocked: true,
        registeredAt: true,
        lastOnline: true
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });
  }

  async getExecutors() {
    return this.prisma.user.findMany({
      where: {
        userrole: {
          some: {
            role: userrole_role.EXECUTOR
          }
        }
      },
      include: {
        profile: {
          include: {
            equipment: true,
            portfolio: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });
  }

  async getUserDetails(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            equipment: true,
            portfolio: true
          }
        },
        dealsAsCustomer: {
          include: {
            executor: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        },
        dealsAsExecutor: {
          include: {
            customer: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        },
        announcements: true,
        complaintsCreated: {
          include: {
            target: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        },
        complaintsAbout: {
          include: {
            author: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async blockUser(userId: number, reason: string, managerId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
        blockReason: reason
      }
    });
  }

  async unblockUser(userId: number, managerId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: false,
        blockedAt: null,
        blockReason: null
      }
    });
  }

  async getAllDeals() {
    return this.prisma.deal.findMany({
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true
          }
        },
        chatRoom: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getActiveDeals() {
    return this.prisma.deal.findMany({
      where: { status: DealStatus.ACTIVE },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getInProgressDeals() {
    return this.prisma.deal.findMany({
      where: { status: DealStatus.IN_PROGRESS },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getDisputeDeals() {
    return this.prisma.deal.findMany({
      where: { status: DealStatus.DISPUTE },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        complaints: {
          include: {
            author: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async getDealDetails(id: number) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        customer: true,
        executor: true,
        chatRoom: {
          include: {
            messages: {
              include: {
                author: {
                  select: {
                    id: true,
                    login: true,
                    fullName: true
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        },
        complaints: {
          include: {
            author: {
              select: {
                id: true,
                login: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal;
  }

  async updateDealStatus(id: number, status: string, reason?: string) {
    return this.prisma.deal.update({
      where: { id },
      data: {
        status: status as DealStatus
      }
    });
  }

  async getAllAnnouncements() {
    return this.prisma.announcement.findMany({
      include: {
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async hideAnnouncement(id: number) {
    return this.prisma.announcement.update({
      where: { id },
      data: { isActive: false }
    });
  }

  async showAnnouncement(id: number) {
    return this.prisma.announcement.update({
      where: { id },
      data: { isActive: true }
    });
  }

  async getAllComplaints() {
    return this.prisma.complaint.findMany({
      include: {
        author: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        target: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        handler: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        deal: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getPendingComplaints() {
    return this.prisma.complaint.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        author: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        target: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        deal: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async getComplaintDetails(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        author: true,
        target: true,
        handler: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        },
        deal: {
          include: {
            chatRoom: {
              include: {
                messages: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        login: true,
                        fullName: true
                      }
                    }
                  },
                  orderBy: {
                    createdAt: 'asc'
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }

  async getActivityLog() {
    const recentDeals = await this.prisma.deal.findMany({
      take: 20,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        }
      }
    });

    const recentComplaints = await this.prisma.complaint.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            login: true,
            fullName: true
          }
        }
      }
    });

    return {
      deals: recentDeals,
      complaints: recentComplaints
    };
  }
}
