import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDealDto, UpdateDealDto, AssignExecutorDto } from './dto/create-deal.dto';
import { DealStatus } from '@prisma/client'
import { userrole_role } from '@prisma/client'

export interface UserWithRoles {
  id: number;
  login: string;
  email: string;
  userrole: { role: userrole_role }[];
}

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: number, createDealDto: CreateDealDto) {
    return this.prisma.deal.create({
      data: {
        customerId,
        ...createDealDto,
        deadline: createDealDto.deadline ? new Date(createDealDto.deadline) : null,
        materials: createDealDto.materials ? JSON.stringify(createDealDto.materials) : null,
        drawings: createDealDto.drawings ? JSON.stringify(createDealDto.drawings) : null,
        attachments: createDealDto.attachments ? JSON.stringify(createDealDto.attachments) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            profile: {
              include: {
                equipment: true,
                portfolio: true
              }
            }
          }
        },
        chatRoom: {
          include: {
            messages: {
              take: 1,
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        }
      }
    });
  }

  async findAll(searchDto?: any) {
    const where: any = {
      status: DealStatus.ACTIVE
    };

    if (searchDto) {
      if (searchDto.category) {
        where.category = {
          contains: searchDto.category
        };
      }
      if (searchDto.region) {
        where.location = {
          contains: searchDto.region
        };
      }
      if (searchDto.isUrgent !== undefined) {
        where.isUrgent = searchDto.isUrgent;
      }
      if (searchDto.minBudget !== undefined || searchDto.maxBudget !== undefined) {
        where.budget = {};
        if (searchDto.minBudget !== undefined) {
          where.budget.gte = searchDto.minBudget;
        }
        if (searchDto.maxBudget !== undefined) {
          where.budget.lte = searchDto.maxBudget;
        }
      }
      if (searchDto.search) {
        where.OR = [
          { title: { contains: searchDto.search } },
          { description: { contains: searchDto.search } }
        ];
      }
      if (searchDto.status) {
        where.status = searchDto.status;
      }
    }

    let orderBy: any = {};
    if (searchDto?.sortBy) {
      if (searchDto.sortBy === 'date') {
        orderBy.createdAt = searchDto.sortOrder || 'desc';
      } else if (searchDto.sortBy === 'budget') {
        orderBy.budget = searchDto.sortOrder || 'asc';
      } else if (searchDto.sortBy === 'deadline') {
        orderBy.deadline = searchDto.sortOrder || 'asc';
      }
    } else {
      orderBy = [
        { isUrgent: 'desc' },
        { createdAt: 'desc' }
      ];
    }

    return this.prisma.deal.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            region: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            region: true,
            profile: {
              include: {
                equipment: true,
                portfolio: true
              }
            }
          }
        }
      },
      orderBy
    });
  }

  async findOne(id: number) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            profile: {
              include: {
                equipment: true,
                portfolio: true
              }
            }
          }
        },
        chatRoom: {
          include: {
            messages: {
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
        }
      }
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal;
  }

  async findByCustomer(customerId: number) {
    return this.prisma.deal.findMany({
      where: { customerId },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            profile: {
              include: {
                equipment: true,
                portfolio: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getCustomerHistory(customerId: number) {
    try {
      if (!customerId || customerId <= 0) {
        throw new BadRequestException('Invalid customer ID');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: customerId },
        select: { id: true, userrole: { select: { role: true } } }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const deals = await this.prisma.deal.findMany({
        where: { customerId },
        include: {
          executor: {
            select: {
              id: true,
              login: true,
              fullName: true,
              avatar: true,
              profile: {
                select: {
                  rating: true,
                  totalReviews: true,
                  completedDeals: true
                }
              }
            }
          },
          reviews: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const stats = {
        total: deals?.length || 0,
        active: deals?.filter(d => d.status === DealStatus.ACTIVE).length || 0,
        inProgress: deals?.filter(d => d.status === DealStatus.IN_PROGRESS).length || 0,
        completed: deals?.filter(d => d.status === DealStatus.COMPLETED).length || 0,
        cancelled: deals?.filter(d => d.status === DealStatus.CANCELLED).length || 0,
        dispute: deals?.filter(d => d.status === DealStatus.DISPUTE).length || 0,
        totalSpent: 0,
        averagePrice: 0,
        reviewsGiven: 0
      };

      try {
        stats.totalSpent = deals
          .filter(d => d.status === DealStatus.COMPLETED && d.price && !isNaN(d.price))
          .reduce((sum, d) => sum + (d.price || 0), 0);
      } catch (error) {
        console.error('Error calculating totalSpent:', error);
        stats.totalSpent = 0;
      }

      const completedWithPrice = deals.filter(d => d.status === DealStatus.COMPLETED && d.price && d.price > 0);
      if (completedWithPrice.length > 0) {
        stats.averagePrice = Math.round(stats.totalSpent / completedWithPrice.length);
      }

      try {
        stats.reviewsGiven = deals.filter(d =>
          d.reviews &&
          Array.isArray(d.reviews) &&
          d.reviews.length > 0 &&
          d.reviews.some(r => r && r.authorId === customerId)
        ).length;
      } catch (error) {
        console.error('Error counting reviews:', error);
        stats.reviewsGiven = 0;
      }

      return {
        deals: deals || [],
        stats
      };
    } catch (error) {
      console.error('Error in getCustomerHistory:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      return {
        deals: [],
        stats: {
          total: 0,
          active: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          dispute: 0,
          totalSpent: 0,
          averagePrice: 0,
          reviewsGiven: 0
        }
      };
    }
  }

  async getExecutorHistory(executorId: number) {
    try {
      if (!executorId || executorId <= 0) {
        throw new BadRequestException('Invalid executor ID');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: executorId },
        select: { id: true, userrole: { select: { role: true } } }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userRoles = user.userrole.map(r => r.role);
      if (!userRoles.includes(userrole_role.EXECUTOR)) {
        throw new BadRequestException('User is not an executor');
      }

      const deals = await this.prisma.deal.findMany({
        where: { executorId },
        include: {
          customer: {
            select: {
              id: true,
              login: true,
              fullName: true,
              avatar: true
            }
          },
          reviews: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const stats = {
        total: deals?.length || 0,
        active: deals?.filter(d => d.status === DealStatus.ACTIVE).length || 0,
        inProgress: deals?.filter(d => d.status === DealStatus.IN_PROGRESS).length || 0,
        completed: deals?.filter(d => d.status === DealStatus.COMPLETED).length || 0,
        cancelled: deals?.filter(d => d.status === DealStatus.CANCELLED).length || 0,
        dispute: deals?.filter(d => d.status === DealStatus.DISPUTE).length || 0,
        totalEarned: 0,
        averagePrice: 0,
        reviewsReceived: 0,
        averageRating: 0
      };

      try {
        stats.totalEarned = deals
          .filter(d => d.status === DealStatus.COMPLETED && d.price && !isNaN(d.price) && d.price > 0)
          .reduce((sum, d) => sum + (d.price || 0), 0);
      } catch (error) {
        console.error('Error calculating totalEarned:', error);
        stats.totalEarned = 0;
      }

      const completedWithPrice = deals.filter(d => d.status === DealStatus.COMPLETED && d.price && d.price > 0);
      if (completedWithPrice.length > 0) {
        stats.averagePrice = Math.round(stats.totalEarned / completedWithPrice.length);
      }

      try {
        stats.reviewsReceived = deals.filter(d =>
          d.reviews &&
          Array.isArray(d.reviews) &&
          d.reviews.length > 0 &&
          d.reviews.some(r => r && r.targetId === executorId)
        ).length;
      } catch (error) {
        console.error('Error counting reviews:', error);
        stats.reviewsReceived = 0;
      }

      try {
        const reviews = deals
          .flatMap(d => d.reviews || [])
          .filter(r => r && r.targetId === executorId && r.rating && !isNaN(r.rating));
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
          stats.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
        }
      } catch (error) {
        console.error('Error calculating average rating:', error);
        stats.averageRating = 0;
      }

      return {
        deals: deals || [],
        stats
      };
    } catch (error) {
      console.error('Error in getExecutorHistory:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      return {
        deals: [],
        stats: {
          total: 0,
          active: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          dispute: 0,
          totalEarned: 0,
          averagePrice: 0,
          reviewsReceived: 0,
          averageRating: 0
        }
      };
    }
  }

  async findByExecutor(executorId: number) {
    return this.prisma.deal.findMany({
      where: { executorId },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            profile: {
              include: {
                equipment: true,
                portfolio: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id: number, userId: number, updateDealDto: UpdateDealDto) {
    const deal = await this.prisma.deal.findUnique({
      where: { id }
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (deal.customerId !== userId) {
      throw new ForbiddenException('You can only update your own deals');
    }

    const updateData: any = { ...updateDealDto };
    if (updateDealDto.materials) {
      updateData.materials = JSON.stringify(updateDealDto.materials);
    }
    if (updateDealDto.drawings) {
      updateData.drawings = JSON.stringify(updateDealDto.drawings);
    }
    if (updateDealDto.attachments) {
      updateData.attachments = JSON.stringify(updateDealDto.attachments);
    }
    if (updateDealDto.deadline) {
      updateData.deadline = new Date(updateDealDto.deadline);
    }

    return this.prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            profile: {
              include: {
                equipment: true,
                portfolio: true
              }
            }
          }
        }
      }
    });
  }

  async assignExecutor(id: number, customerId: number, assignExecutorDto: AssignExecutorDto) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid deal ID');
      }
      if (!customerId || customerId <= 0) {
        throw new BadRequestException('Invalid customer ID');
      }
      if (!assignExecutorDto.executorId || assignExecutorDto.executorId <= 0) {
        throw new BadRequestException('Invalid executor ID');
      }

      return await this.prisma.$transaction(async (tx) => {
        const deal = await tx.deal.findUnique({
          where: { id },
          include: { chatRoom: true }
        });

        if (!deal) {
          throw new NotFoundException('Deal not found');
        }

        if (deal.customerId !== customerId) {
          throw new ForbiddenException('You can only assign executor to your own deals');
        }

        if (deal.status !== DealStatus.ACTIVE) {
          throw new BadRequestException('Cannot assign executor to inactive deal');
        }

        const executor = await tx.user.findUnique({
          where: { id: assignExecutorDto.executorId },
          include: { userrole: { select: { role: true } } }
        });

        if (!executor) {
          throw new BadRequestException('Executor not found');
        }

        const executorRoles = executor.userrole.map(r => r.role);
        if (!executorRoles.includes(userrole_role.EXECUTOR)) {
          throw new BadRequestException('User is not an executor');
        }

        let chatRoom;
        if (!deal.chatRoom) {
          chatRoom = await tx.chatRoom.create({
            data: {
              dealId: id
            }
          });
          
          // Add members to chat room
          await tx.chatRoomMembers.createMany({
            data: [
              { roomId: chatRoom.id, userId: customerId },
              { roomId: chatRoom.id, userId: assignExecutorDto.executorId }
            ]
          });
          console.log(`Chat room created for deal ${id}`);
        } else {
          chatRoom = deal.chatRoom;
          console.log(`Using existing chat room ${chatRoom.id} for deal ${id}`);
        }

        const updatedDeal = await tx.deal.update({
          where: { id },
          data: {
            executorId: assignExecutorDto.executorId,
            price: assignExecutorDto.price,
            status: DealStatus.IN_PROGRESS
          },
          include: {
            customer: {
              select: {
                id: true,
                login: true,
                fullName: true,
                email: true,
                phone: true
              }
            },
            executor: {
              select: {
                id: true,
                login: true,
                fullName: true,
                email: true,
                phone: true,
                profile: {
                  include: {
                    equipment: true,
                    portfolio: true
                  }
                }
              }
            },
            chatRoom: true
          }
        });

        try {
          await tx.notification.create({
            data: {
              userId: assignExecutorDto.executorId,
              title: 'Новый заказ',
              message: `Вы назначены исполнителем на заказ "${deal.title}"`,
              type: 'DEAL_ASSIGNED',
              relatedId: id
            }
          });
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
        }

        console.log(`Executor ${assignExecutorDto.executorId} assigned to deal ${id}`);
        return updatedDeal;
      });
    } catch (error) {
      console.error('Error in assignExecutor:', error);
      if (error instanceof NotFoundException ||
          error instanceof ForbiddenException ||
          error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to assign executor to deal');
    }
  }

  async completeDeal(id: number, userId: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid deal ID');
      }
      if (!userId || userId <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      return await this.prisma.$transaction(async (tx) => {
        const deal = await tx.deal.findUnique({
          where: { id },
          include: {
            customer: true,
            executor: {
              include: {
                profile: true
              }
            }
          }
        });

        if (!deal) {
          throw new NotFoundException('Deal not found');
        }

        if (deal.executorId !== userId) {
          throw new ForbiddenException('Only executor can complete the deal');
        }

        if (deal.status !== DealStatus.IN_PROGRESS) {
          throw new BadRequestException('Deal is not in progress');
        }

        const updatedDeal = await tx.deal.update({
          where: { id },
          data: {
            status: DealStatus.COMPLETED,
            completedAt: new Date()
          },
          include: {
            customer: {
              select: {
                id: true,
                login: true,
                fullName: true,
                email: true,
                phone: true
              }
            },
            executor: {
              select: {
                id: true,
                login: true,
                fullName: true,
                email: true,
                phone: true,
                profile: {
                  include: {
                    equipment: true,
                    portfolio: true
                  }
                }
              }
            }
          }
        });

        if (deal.executor?.profile) {
          try {
            await tx.profile.update({
              where: { userId: deal.executorId },
              data: {
                completedDeals: {
                  increment: 1
                }
              }
            });
            console.log(`Updated completed deals count for executor ${deal.executorId}`);
          } catch (profileError) {
            console.error('Failed to update executor profile:', profileError);
          }
        }

        try {
          await tx.notification.create({
            data: {
              userId: deal.customerId,
              title: 'Заказ выполнен',
              message: `Заказ "${deal.title}" отмечен как выполненный`,
              type: 'DEAL_COMPLETED',
              relatedId: id
            }
          });
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
        }

        console.log(`Deal ${id} completed by executor ${userId}`);
        return updatedDeal;
      });
    } catch (error) {
      console.error('Error in completeDeal:', error);
      if (error instanceof NotFoundException ||
          error instanceof ForbiddenException ||
          error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to complete deal');
    }
  }

  async calculatePrice(params: {
    category: string;
    complexity?: 'low' | 'medium' | 'high';
    materials?: string[];
    estimatedTime?: number;
    isUrgent?: boolean;
    location?: string;
  }) {
    try {
      if (!params || !params.category) {
        throw new BadRequestException('Category is required');
      }

      if (typeof params.category !== 'string' || params.category.trim().length === 0) {
        throw new BadRequestException('Invalid category format');
      }

      if (params.complexity && !['low', 'medium', 'high'].includes(params.complexity)) {
        throw new BadRequestException('Invalid complexity value. Must be: low, medium, or high');
      }

      if (params.estimatedTime !== undefined) {
        const time = Number(params.estimatedTime);
        if (isNaN(time) || time <= 0 || time > 365) {
          throw new BadRequestException('Invalid estimated time. Must be between 1 and 365 days');
        }
      }

      const basePrices: Record<string, number> = {
        'Металлообработка': 5000,
        'Деревообработка': 4000,
        'Электромонтаж': 6000,
        'Сварочные работы': 7000,
        'Токарные работы': 8000,
        'Фрезерные работы': 9000,
        'Штамповка': 6500,
        'Гибка металла': 5500,
        'default': 5000
      };

      let basePrice = basePrices[params.category] || basePrices['default'];

      const complexityMultiplier: Record<string, number> = {
        'low': 1.0,
        'medium': 1.5,
        'high': 2.0
      };

      const complexity = params.complexity || 'medium';
      basePrice *= complexityMultiplier[complexity];

      let materialsCount = 0;
      if (params.materials && Array.isArray(params.materials)) {
        materialsCount = Math.min(params.materials.length, 10);
        basePrice += basePrice * 0.2 * materialsCount;
      }

      if (params.estimatedTime) {
        const time = Number(params.estimatedTime);
        if (!isNaN(time)) {
          if (time > 7) {
            basePrice *= 0.9;
          } else if (time < 2) {
            basePrice *= 1.3;
          }
        }
      }

      if (params.isUrgent === true) {
        basePrice *= 1.5;
      }

      let marketAverage = basePrice;
      let samplesCount = 0;

      try {
        const similarDeals = await this.prisma.deal.findMany({
          where: {
            category: params.category,
            status: DealStatus.COMPLETED,
            price: {
              not: null,
              gt: 0
            }
          },
          select: {
            price: true
          },
          take: 20,
          orderBy: {
            completedAt: 'desc'
          }
        });

        samplesCount = similarDeals.length;
        if (similarDeals.length > 0) {
          const validPrices = similarDeals
            .map(d => d.price)
            .filter(p => p !== null && !isNaN(p) && p > 0);
          if (validPrices.length > 0) {
            const sum = validPrices.reduce((acc, price) => acc + (price || 0), 0);
            marketAverage = sum / validPrices.length;
          }
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }

      const estimatedPrice = (basePrice + marketAverage) / 2;

      if (isNaN(estimatedPrice) || estimatedPrice <= 0) {
        throw new Error('Calculated price is invalid');
      }

      return {
        estimatedPrice: Math.max(100, Math.round(estimatedPrice)),
        minPrice: Math.max(100, Math.round(estimatedPrice * 0.7)),
        maxPrice: Math.round(estimatedPrice * 1.3),
        marketAverage: Math.round(marketAverage),
        calculatedBase: Math.round(basePrice),
        breakdown: {
          basePrice: basePrices[params.category] || basePrices['default'],
          complexityMultiplier: complexityMultiplier[complexity],
          materialsCount,
          estimatedTime: params.estimatedTime,
          isUrgent: params.isUrgent || false,
          samplesCount
        }
      };
    } catch (error) {
      console.error('Error in calculatePrice:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      const defaultPrice = 5000;
      return {
        estimatedPrice: defaultPrice,
        minPrice: Math.round(defaultPrice * 0.7),
        maxPrice: Math.round(defaultPrice * 1.3),
        marketAverage: defaultPrice,
        calculatedBase: defaultPrice,
        breakdown: {
          basePrice: defaultPrice,
          complexityMultiplier: 1.5,
          materialsCount: 0,
          estimatedTime: undefined,
          isUrgent: false,
          samplesCount: 0
        }
      };
    }
  }

  async remove(id: number, userId: number) {
    const deal = await this.prisma.deal.findUnique({
      where: { id }
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (deal.customerId !== userId) {
      throw new ForbiddenException('You can only delete your own deals');
    }

    return this.prisma.deal.delete({
      where: { id }
    });
  }

  async searchByCategory(category: string) {
    return this.prisma.deal.findMany({
      where: {
        status: DealStatus.ACTIVE,
        category: {
          contains: category
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
