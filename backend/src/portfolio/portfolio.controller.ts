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
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioItemDto, UpdatePortfolioItemDto } from './dto/create-portfolio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userrole_role } from '@prisma/client';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post(':profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userrole_role.EXECUTOR)
  create(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Request() req,
    @Body() createPortfolioItemDto: CreatePortfolioItemDto
  ) {
    return this.portfolioService.create(profileId, req.user.id, createPortfolioItemDto);
  }

  @Get('profile/:profileId')
  findAllByProfile(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.portfolioService.findAllByProfile(profileId);
  }

  @Get('search/category')
  searchByCategory(@Query('category') category: string) {
    return this.portfolioService.searchByCategory(category);
  }

  @Get('search/materials')
  searchByMaterials(@Query('materials') materials: string) {
    const materialsArray = materials ? materials.split(',') : [];
    return this.portfolioService.searchByMaterials(materialsArray);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userrole_role.EXECUTOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updatePortfolioItemDto: UpdatePortfolioItemDto
  ) {
    return this.portfolioService.update(id, req.user.id, updatePortfolioItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userrole_role.EXECUTOR, userrole_role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.portfolioService.remove(id, req.user.id);
  }
}
