import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/create-profile.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Auth([userrole_role.EXECUTOR])
  @Post()
  create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(req.user.id, createProfileDto);
  }

  @Get()
  findAll(@Query('specialization') specialization?: string) {
    if (specialization) {
      return this.profilesService.searchBySpecialization(specialization);
    }
    return this.profilesService.findAll();
  }

  @Get('top')
  getTopExecutors(@Query('limit') limit?: string) {
    const limitNum = limit ? Number(limit) : undefined;
    return this.profilesService.getTopExecutors(limitNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.findByUserId(userId);
  }

  @Auth([userrole_role.EXECUTOR])
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.profilesService.update(id, req.user.id, updateProfileDto);
  }

  @Auth([userrole_role.EXECUTOR, userrole_role.ADMIN])
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.profilesService.remove(id, req.user.id);
  }

  @Get('rating/:userId')
  getUserRating(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.getUserRating(userId);
  }

  @Get('rating/my')
  @Auth([userrole_role.CUSTOMER, userrole_role.EXECUTOR])
  getMyRating(@Request() req) {
    return this.profilesService.getUserRating(req.user.id);
  }
}
