import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto, SearchAnnouncementDto } from './dto/create-announcement.dto';
import { userrole_role, userrole } from '@prisma/client';

export interface UserWithRoles {
  id: number;
  login: string;
  email: string;
  userrole: userrole[];
}

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(executorId: number, createAnnouncementDto: CreateAnnouncementDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: executorId },
      include: { userrole: { select: { role: true } } }
    });
    
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    
    const userRoles = user.userrole.map(r => r.role);
    if (!userRoles.includes(userrole_role.EXECUTOR)) {
      throw new ForbiddenException('Only executors can create announcements');
    }

    return this.prisma.announcement.create({
      data: {
        executorId,
        ...createAnnouncementDto,
        images: createAnnouncementDto.images ? JSON.stringify(createAnnouncementDto.images) : null,
        attachments: createAnnouncementDto.attachments ? JSON.stringify(createAnnouncementDto.attachments) : null,
      },
      include: {
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
      }
    });
  }

  async findAll(searchDto?: SearchAnnouncementDto) {
    const where: any = {
      isActive: true,
      isHidden: false
    };

    if (searchDto) {
      if (searchDto.category) {
        where.category = {
          contains: searchDto.category
        };
      }
      if (searchDto.region) {
        where.region = {
          contains: searchDto.region
        };
      }
      if (searchDto.isUrgent !== undefined) {
        where.isUrgent = searchDto.isUrgent;
      }
      if (searchDto.minPrice !== undefined || searchDto.maxPrice !== undefined) {
        where.priceFrom = {};
        if (searchDto.minPrice !== undefined) {
          where.priceFrom.gte = searchDto.minPrice;
        }
        if (searchDto.maxPrice !== undefined) {
          where.priceFrom.lte = searchDto.maxPrice;
        }
      }
      if (searchDto.search) {
        where.OR = [
          { title: { contains: searchDto.search } },
          { description: { contains: searchDto.search } }
        ];
      }
    }

    let orderBy: any = {};
    if (searchDto?.sortBy) {
      if (searchDto.sortBy === 'date') {
        orderBy.createdAt = searchDto.sortOrder || 'desc';
      } else if (searchDto.sortBy === 'price') {
        orderBy.priceFrom = searchDto.sortOrder || 'asc';
      } else if (searchDto.sortBy === 'views') {
        orderBy.views = searchDto.sortOrder || 'desc';
      }
    } else {
      orderBy = [
        { isUrgent: 'desc' },
        { createdAt: 'desc' }
      ];
    }

    return this.prisma.announcement.findMany({
      where,
      include: {
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            region: true,
            profile: {
              select: {
                rating: true,
                totalReviews: true,
                completedDeals: true,
                specializations: true
              }
            }
          }
        }
      },
      orderBy
    });
  }

  async findOne(id: number) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
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
      }
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    await this.prisma.announcement.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return announcement;
  }

  async findByExecutor(executorId: number) {
    return this.prisma.announcement.findMany({
      where: { executorId },
      include: {
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            region: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id: number, executorId: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    if (announcement.executorId !== executorId) {
      throw new ForbiddenException('You can only update your own announcements');
    }

    const updateData: any = { ...updateAnnouncementDto };
    if (updateAnnouncementDto.images) {
      updateData.images = JSON.stringify(updateAnnouncementDto.images);
    }
    if (updateAnnouncementDto.attachments) {
      updateData.attachments = JSON.stringify(updateAnnouncementDto.attachments);
    }

    return this.prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        executor: {
          select: {
            id: true,
            login: true,
            fullName: true,
            region: true
          }
        }
      }
    });
  }

  async hide(id: number, executorId: number) {
    return this.update(id, executorId, { isHidden: true });
  }

  async show(id: number, executorId: number) {
    return this.update(id, executorId, { isHidden: false });
  }

  async remove(id: number, executorId: number) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    if (announcement.executorId !== executorId) {
      throw new ForbiddenException('You can only delete your own announcements');
    }

    return this.prisma.announcement.delete({
      where: { id }
    });
  }

  async searchByCategory(category: string) {
    return this.findAll({ category });
  }

  async searchByRegion(region: string) {
    return this.findAll({ region });
  }

  async getUrgent() {
    return this.findAll({ isUrgent: true });
  }
}
