import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePortfolioItemDto, UpdatePortfolioItemDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async create(profileId: number, userId: number, createPortfolioItemDto: CreatePortfolioItemDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only add portfolio items to your own profile');
    }

    return this.prisma.portfolioItem.create({
      data: {
        profileId,
        ...createPortfolioItemDto,
        images: createPortfolioItemDto.images ? JSON.stringify(createPortfolioItemDto.images) : null,
        materials: createPortfolioItemDto.materials ? JSON.stringify(createPortfolioItemDto.materials) : null
      }
    });
  }

  async findAllByProfile(profileId: number) {
    return this.prisma.portfolioItem.findMany({
      where: { profileId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const portfolioItem = await this.prisma.portfolioItem.findUnique({
      where: { id }
    });

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio item not found');
    }

    return portfolioItem;
  }

  async update(id: number, userId: number, updatePortfolioItemDto: UpdatePortfolioItemDto) {
    const portfolioItem = await this.prisma.portfolioItem.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (portfolioItem.profile.userId !== userId) {
      throw new ForbiddenException('You can only update portfolio items in your own profile');
    }

    const updateData: any = { ...updatePortfolioItemDto };
    if (updatePortfolioItemDto.images) {
      updateData.images = JSON.stringify(updatePortfolioItemDto.images);
    }
    if (updatePortfolioItemDto.materials) {
      updateData.materials = JSON.stringify(updatePortfolioItemDto.materials);
    }

    return this.prisma.portfolioItem.update({
      where: { id },
      data: updateData
    });
  }

  async remove(id: number, userId: number) {
    const portfolioItem = await this.prisma.portfolioItem.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (portfolioItem.profile.userId !== userId) {
      throw new ForbiddenException('You can only delete portfolio items from your own profile');
    }

    return this.prisma.portfolioItem.delete({
      where: { id }
    });
  }

  async searchByCategory(category: string) {
    return this.prisma.portfolioItem.findMany({
      where: {
        category: {
          contains: category
        },
        profile: {
          isPublic: true
        }
      },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                login: true,
                fullName: true,
                email: true,
                phone: true
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

  async searchByMaterials(materials: string[]) {
    const items = await this.prisma.portfolioItem.findMany({
      where: {
        profile: {
          isPublic: true
        }
      },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                login: true,
                fullName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Фильтруем в коде, так как MySQL не поддерживает hasSome для JSON
    return items.filter(item => {
      if (!item.materials) return false;
      const itemMaterials = typeof item.materials === 'string' 
        ? JSON.parse(item.materials) 
        : item.materials;
      return materials.some(m => itemMaterials.includes(m));
    });
  }
}