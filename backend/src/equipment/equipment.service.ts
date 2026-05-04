import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(profileId: number, userId: number, createEquipmentDto: CreateEquipmentDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only add equipment to your own profile');
    }

    return this.prisma.equipment.create({
      data: {
        profileId,
        ...createEquipmentDto,
        images: createEquipmentDto.images ? JSON.stringify(createEquipmentDto.images) : null
      }
    });
  }

  async findAllByProfile(profileId: number) {
    return this.prisma.equipment.findMany({
      where: { profileId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id }
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return equipment;
  }

  async update(id: number, userId: number, updateEquipmentDto: UpdateEquipmentDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    if (equipment.profile.userId !== userId) {
      throw new ForbiddenException('You can only update equipment in your own profile');
    }

    const updateData: any = { ...updateEquipmentDto };
    if (updateEquipmentDto.images) {
      updateData.images = JSON.stringify(updateEquipmentDto.images);
    }

    return this.prisma.equipment.update({
      where: { id },
      data: updateData
    });
  }

  async remove(id: number, userId: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    if (equipment.profile.userId !== userId) {
      throw new ForbiddenException('You can only delete equipment from your own profile');
    }

    return this.prisma.equipment.delete({
      where: { id }
    });
  }

  async searchByType(type: string) {
    return this.prisma.equipment.findMany({
      where: {
        type: {
          contains: type
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
}