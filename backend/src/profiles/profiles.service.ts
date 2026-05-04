import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/create-profile.dto';
import { userrole_role } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createProfileDto: CreateProfileDto) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      throw new ForbiddenException('Profile already exists for this user');
    }

    const data: any = {
      userId,
      ...createProfileDto
    };

    if (createProfileDto.specializations) {
      data.specializations = JSON.stringify(createProfileDto.specializations);
    }

    return this.prisma.profile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      }
    });
  }

  async findAll() {
    return this.prisma.profile.findMany({
      where: {
        isPublic: true
      },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      },
      orderBy: {
        rating: 'desc'
      }
    });
  }

  async getUserRating(userId: number) {
    try {
      if (!userId || userId <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true }
      });

      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      const profile = await this.prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              login: true,
              fullName: true,
              avatar: true,
              registeredAt: true
            }
          }
        }
      }).catch(error => {
        console.error('Error fetching profile:', error);
        return null;
      });

      const reviews = await this.prisma.review.findMany({
        where: { targetId: userId },
        include: {
          author: {
            select: {
              id: true,
              login: true,
              fullName: true,
              avatar: true
            }
          },
          deal: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      }).catch(error => {
        console.error('Error fetching reviews:', error);
        return [];
      });

      const dealsAsExecutor = await this.prisma.deal.findMany({
        where: { executorId: userId },
        select: {
          status: true,
          price: true,
          completedAt: true,
          createdAt: true
        }
      }).catch(error => {
        console.error('Error fetching executor deals:', error);
        return [];
      });

      const dealsAsCustomer = await this.prisma.deal.findMany({
        where: { customerId: userId },
        select: {
          status: true,
          price: true,
          completedAt: true,
          createdAt: true
        }
      }).catch(error => {
        console.error('Error fetching customer deals:', error);
        return [];
      });

      const executorStats = {
        total: dealsAsExecutor?.length || 0,
        completed: 0,
        inProgress: 0,
        cancelled: 0,
        totalEarned: 0,
        completionRate: 0,
        avgCompletionTime: 0
      };

      try {
        executorStats.completed = dealsAsExecutor.filter(d => d.status === 'COMPLETED').length;
        executorStats.inProgress = dealsAsExecutor.filter(d => d.status === 'IN_PROGRESS').length;
        executorStats.cancelled = dealsAsExecutor.filter(d => d.status === 'CANCELLED').length;
        executorStats.totalEarned = dealsAsExecutor
          .filter(d => d.status === 'COMPLETED' && d.price && !isNaN(d.price) && d.price > 0)
          .reduce((sum, d) => sum + (d.price || 0), 0);

        if (executorStats.total > 0) {
          executorStats.completionRate = Math.round((executorStats.completed / executorStats.total) * 100);
        }
      } catch (error) {
        console.error('Error calculating executor stats:', error);
      }

      const customerStats = {
        total: dealsAsCustomer?.length || 0,
        completed: 0,
        inProgress: 0,
        cancelled: 0,
        totalSpent: 0
      };

      try {
        customerStats.completed = dealsAsCustomer.filter(d => d.status === 'COMPLETED').length;
        customerStats.inProgress = dealsAsCustomer.filter(d => d.status === 'IN_PROGRESS').length;
        customerStats.cancelled = dealsAsCustomer.filter(d => d.status === 'CANCELLED').length;
        customerStats.totalSpent = dealsAsCustomer
          .filter(d => d.status === 'COMPLETED' && d.price && !isNaN(d.price) && d.price > 0)
          .reduce((sum, d) => sum + (d.price || 0), 0);
      } catch (error) {
        console.error('Error calculating customer stats:', error);
      }

      const reviewStats = {
        total: reviews?.length || 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };

      try {
        const validReviews = reviews.filter(r => r && r.rating && !isNaN(r.rating) && r.rating >= 1 && r.rating <= 5);
        if (validReviews.length > 0) {
          const totalRating = validReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
          reviewStats.averageRating = Math.round((totalRating / validReviews.length) * 10) / 10;
        }

        [5, 4, 3, 2, 1].forEach(rating => {
          reviewStats.ratingDistribution[rating] = validReviews.filter(r => r.rating === rating).length;
        });
      } catch (error) {
        console.error('Error calculating review stats:', error);
      }

      const stats = {
        asExecutor: executorStats,
        asCustomer: customerStats,
        reviews: reviewStats
      };

      return {
        profile: profile || null,
        reviews: (reviews || []).slice(0, 10),
        stats
      };
    } catch (error) {
      console.error('Error in getUserRating:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to load user rating');
    }
  }

  async updateProfileRating(userId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { targetId: userId },
      select: { rating: true }
    });

    const completedDeals = await this.prisma.deal.count({
      where: {
        executorId: userId,
        status: 'COMPLETED'
      }
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const profile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    if (profile) {
      await this.prisma.profile.update({
        where: { userId },
        data: {
          rating: averageRating,
          totalReviews: reviews.length,
          completedDeals
        }
      });
    }

    return {
      rating: averageRating,
      totalReviews: reviews.length,
      completedDeals
    };
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async findByUserId(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(id: number, userId: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updateData: any = { ...updateProfileDto };
    if (updateProfileDto.specializations) {
      updateData.specializations = JSON.stringify(updateProfileDto.specializations);
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      }
    });
  }

  async remove(id: number, userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    return this.prisma.profile.delete({
      where: { id }
    });
  }

  async searchBySpecialization(specialization: string) {
    const profiles = await this.prisma.profile.findMany({
      where: {
        isPublic: true
      },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      },
      orderBy: {
        rating: 'desc'
      }
    });

    // Фильтруем в коде, так как MySQL не поддерживает has для JSON
    return profiles.filter(profile => {
      if (!profile.specializations) return false;
      const specs = typeof profile.specializations === 'string'
        ? JSON.parse(profile.specializations)
        : profile.specializations;
      return specs.includes(specialization);
    });
  }

  async getTopExecutors(limit: number = 10) {
    return this.prisma.profile.findMany({
      where: {
        isPublic: true,
        user: {
          userrole: {
            some: {
              role: userrole_role.EXECUTOR
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        equipment: true,
        portfolio: true
      },
      orderBy: {
        rating: 'desc'
      },
      take: limit
    });
  }
}
