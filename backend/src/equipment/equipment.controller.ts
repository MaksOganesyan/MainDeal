import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userrole_role } from '@prisma/client';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post(':profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userrole_role.EXECUTOR)
  create(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Request() req,
    @Body() createEquipmentDto: CreateEquipmentDto
  ) {
    return this.equipmentService.create(profileId, req.user.id, createEquipmentDto);
  }

  @Get('profile/:profileId')
  findAllByProfile(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.equipmentService.findAllByProfile(profileId);
  }

  @Get('search')
  searchByType(@Query('type') type: string) {
    return this.equipmentService.searchByType(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipmentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userrole_role.EXECUTOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateEquipmentDto: UpdateEquipmentDto
  ) {
    return this.equipmentService.update(id, req.user.id, updateEquipmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userrole_role.EXECUTOR, userrole_role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.equipmentService.remove(id, req.user.id);
  }
}
