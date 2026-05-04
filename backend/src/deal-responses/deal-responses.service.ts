import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDealResponseDto, UpdateResponseStatusDto } from './dto/create-response.dto';
import { ResponseStatus } from '@prisma/client'
import { userrole_role } from '@prisma/client'

@Injectable()
export class DealResponsesService {
  constructor(private prisma: PrismaService) {}

  async createResponse(executorId: number, dto: CreateDealResponseDto) {
    try {
      if (!executorId || executorId <= 0) {
        throw new BadRequestException('Invalid executor ID');
      }
      if (!dto.dealId || dto.dealId <= 0) {
        throw new BadRequestException('Invalid deal ID');
      }

      const deal = await this.prisma.deal.findUnique({
        where: { id: dto.dealId },
        include: { customer: true },
      });

      if (!deal) {
        throw new NotFoundException('Deal not found');
      }

      if (deal.status !== 'ACTIVE') {
        throw new BadRequestException('Deal is not accepting responses');
      }

      if (deal.customerId === executorId) {
        throw new ForbiddenException('Cannot respond to your own deal');
      }

      const existingResponse = await this.prisma.dealResponse.findUnique({
        where: {
          dealId_executorId: {
            dealId: dto.dealId,
            executorId,
          },
        },
      });

      if (existingResponse) {
        throw new ConflictException('You have already responded to this deal');
      }

      const response = await this.prisma.dealResponse.create({
        data: {
          dealId: dto.dealId,
          executorId,
          message: dto.message,
          proposedPrice: dto.proposedPrice,
          estimatedDays: dto.estimatedDays,
          portfolioLinks: dto.portfolioLinks ? JSON.stringify(dto.portfolioLinks) : null,
          experience: dto.experience,
          status: ResponseStatus.PENDING,
        },
        include: {
          executor: {
            select: {
              id: true,
              fullName: true,
              login: true,
              avatar: true,
              profile: true,
            },
          },
          deal: {
            select: {
              id: true,
              title: true,
              customerId: true,
            },
          },
        },
      });

      try {
        await this.prisma.notification.create({
          data: {
            userId: deal.customerId,
            type: 'SYSTEM',
            title: 'Новый отклик на ваш заказ',
            message: `Исполнитель ${response.executor.fullName || response.executor.login} откликнулся на заказ "${deal.title}"`,
            relatedId: dto.dealId,
            link: `/deals/${dto.dealId}/responses`,
          },
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      return response;
    } catch (error) {
      console.error('Error creating response:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create response');
    }
  }

  async getExecutorResponses(executorId: number) {
    try {
      if (!executorId || executorId <= 0) {
        throw new BadRequestException('Invalid executor ID');
      }

      return this.prisma.dealResponse.findMany({
        where: { executorId },
        include: {
          deal: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              budget: true,
              deadline: true,
              location: true,
              status: true,
              customer: {
                select: {
                  id: true,
                  fullName: true,
                  login: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching executor responses:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch responses');
    }
  }

  async getDealResponses(dealId: number, customerId: number) {
    try {
      if (!dealId || dealId <= 0) {
        throw new BadRequestException('Invalid deal ID');
      }
      if (!customerId || customerId <= 0) {
        throw new BadRequestException('Invalid customer ID');
      }

      const deal = await this.prisma.deal.findUnique({
        where: { id: dealId },
      });

      if (!deal) {
        throw new NotFoundException('Deal not found');
      }

      if (deal.customerId !== customerId) {
        throw new ForbiddenException('You can only view responses to your own deals');
      }

      return this.prisma.dealResponse.findMany({
        where: { dealId },
        include: {
          executor: {
            select: {
              id: true,
              fullName: true,
              login: true,
              avatar: true,
              profile: {
                select: {
                  rating: true,
                  totalReviews: true,
                  completedDeals: true,
                  specializations: true,
                  experience: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching deal responses:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch responses');
    }
  }

  async acceptResponse(responseId: number, customerId: number) {
    try {
      if (!responseId || responseId <= 0) {
        throw new BadRequestException('Invalid response ID');
      }
      if (!customerId || customerId <= 0) {
        throw new BadRequestException('Invalid customer ID');
      }

      const response = await this.prisma.dealResponse.findUnique({
        where: { id: responseId },
        include: {
          deal: true,
          executor: {
            select: {
              id: true,
              fullName: true,
              login: true,
            },
          },
        },
      });

      if (!response) {
        throw new NotFoundException('Response not found');
      }

      if (response.deal.customerId !== customerId) {
        throw new ForbiddenException('You can only accept responses to your own deals');
      }

      if (response.status !== ResponseStatus.PENDING) {
        throw new BadRequestException('Response has already been processed');
      }

      if (response.deal.status !== 'ACTIVE') {
        throw new BadRequestException('Deal is no longer active');
      }

      return await this.prisma.$transaction(async (tx) => {
        const updatedResponse = await tx.dealResponse.update({
          where: { id: responseId },
          data: {
            status: ResponseStatus.ACCEPTED,
            respondedAt: new Date(),
          },
          include: {
            executor: {
              select: {
                id: true,
                fullName: true,
                login: true,
                avatar: true,
              },
            },
            deal: true,
          },
        });

        await tx.deal.update({
          where: { id: response.deal.id },
          data: {
            executorId: response.executorId,
            status: 'IN_PROGRESS',
            price: response.proposedPrice,
            estimatedTime: response.estimatedDays,
          },
        });

        await tx.dealResponse.updateMany({
          where: {
            dealId: response.deal.id,
            id: { not: responseId },
            status: ResponseStatus.PENDING,
          },
          data: {
            status: ResponseStatus.REJECTED,
            respondedAt: new Date(),
            rejectionReason: 'Выбран другой исполнитель',
          },
        });

        try {
          const manager = await tx.user.findFirst({
            where: {
              userrole: { some: { role: userrole_role.MANAGER } },
              isActive: true,
            },
          });

          if (manager) {
            let chatRoom = await tx.chatRoom.findFirst({
              where: { dealId: response.deal.id },
            });

            if (!chatRoom) {
              chatRoom = await tx.chatRoom.create({
                data: {
                  dealId: response.deal.id,
                  managerId: manager.id,
                  chatRoomMembers: {
                    connect: [
                      { id: customerId },
                      { id: response.executorId },
                      { id: manager.id },
                    ],
                  },
                },
              });

              await tx.chatMessage.create({
                data: {
                  roomId: chatRoom.id,
                  authorId: manager.id,
                  content: `Здравствуйте! Я буду посредником в общении по заказу "${response.deal.title}". Все сообщения проходят через меня для обеспечения безопасности.`,
                  type: 'SYSTEM',
                  recipientId: null,
                },
              });
            }
          }
        } catch (chatError) {
          console.error('Failed to create chat room:', chatError);
        }

        try {
          await tx.notification.create({
            data: {
              userId: response.executorId,
              type: 'DEAL_ASSIGNED',
              title: 'Ваш отклик принят!',
              message: `Ваш отклик на заказ "${response.deal.title}" был принят. Свяжитесь с заказчиком через чат.`,
              relatedId: response.deal.id,
              link: `/deals/${response.deal.id}`,
            },
          });

          const otherResponses = await tx.dealResponse.findMany({
            where: {
              dealId: response.deal.id,
              id: { not: responseId },
              status: ResponseStatus.REJECTED,
            },
          });

          for (const otherResponse of otherResponses) {
            await tx.notification.create({
              data: {
                userId: otherResponse.executorId,
                type: 'SYSTEM',
                title: 'Ваш отклик отклонен',
                message: `К сожалению, ваш отклик на заказ "${response.deal.title}" не был принят.`,
                relatedId: response.deal.id,
              },
            });
          }
        } catch (notificationError) {
          console.error('Failed to create notifications:', notificationError);
        }

        return updatedResponse;
      });
    } catch (error) {
      console.error('Error accepting response:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to accept response');
    }
  }

  async rejectResponse(
    responseId: number,
    customerId: number,
    dto: UpdateResponseStatusDto,
  ) {
    try {
      if (!responseId || responseId <= 0) {
        throw new BadRequestException('Invalid response ID');
      }
      if (!customerId || customerId <= 0) {
        throw new BadRequestException('Invalid customer ID');
      }

      const response = await this.prisma.dealResponse.findUnique({
        where: { id: responseId },
        include: {
          deal: true,
          executor: {
            select: {
              id: true,
              fullName: true,
              login: true,
            },
          },
        },
      });

      if (!response) {
        throw new NotFoundException('Response not found');
      }

      if (response.deal.customerId !== customerId) {
        throw new ForbiddenException('You can only reject responses to your own deals');
      }

      if (response.status !== ResponseStatus.PENDING) {
        throw new BadRequestException('Response has already been processed');
      }

      const updatedResponse = await this.prisma.dealResponse.update({
        where: { id: responseId },
        data: {
          status: ResponseStatus.REJECTED,
          respondedAt: new Date(),
          rejectionReason: dto.rejectionReason || 'Не указана',
        },
        include: {
          executor: {
            select: {
              id: true,
              fullName: true,
              login: true,
              avatar: true,
            },
          },
          deal: true,
        },
      });

      try {
        await this.prisma.notification.create({
          data: {
            userId: response.executorId,
            type: 'SYSTEM',
            title: 'Ваш отклик отклонен',
            message: `Ваш отклик на заказ "${response.deal.title}" был отклонен.`,
            relatedId: response.deal.id,
          },
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      return updatedResponse;
    } catch (error) {
      console.error('Error rejecting response:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to reject response');
    }
  }

  async withdrawResponse(responseId: number, executorId: number) {
    try {
      if (!responseId || responseId <= 0) {
        throw new BadRequestException('Invalid response ID');
      }
      if (!executorId || executorId <= 0) {
        throw new BadRequestException('Invalid executor ID');
      }

      const response = await this.prisma.dealResponse.findUnique({
        where: { id: responseId },
        include: {
          deal: {
            select: {
              id: true,
              title: true,
              customerId: true,
            },
          },
        },
      });

      if (!response) {
        throw new NotFoundException('Response not found');
      }

      if (response.executorId !== executorId) {
        throw new ForbiddenException('You can only withdraw your own responses');
      }

      if (response.status !== ResponseStatus.PENDING) {
        throw new BadRequestException('Can only withdraw pending responses');
      }

      await this.prisma.dealResponse.delete({
        where: { id: responseId },
      });

      try {
        await this.prisma.notification.create({
          data: {
            userId: response.deal.customerId,
            type: 'SYSTEM',
            title: 'Отклик отозван',
            message: `Исполнитель отозвал свой отклик на заказ "${response.deal.title}"`,
            relatedId: response.deal.id,
          },
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      return { message: 'Response withdrawn successfully' };
    } catch (error) {
      console.error('Error withdrawing response:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to withdraw response');
    }
  }
}
