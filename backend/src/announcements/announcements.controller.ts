import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto, SearchAnnouncementDto } from './dto/create-announcement.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Auth([userrole_role.EXECUTOR])
  create(
    @Request() req,
    @Body() createAnnouncementDto: CreateAnnouncementDto
  ) {
    return this.announcementsService.create(req.user.id, createAnnouncementDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchAnnouncementDto) {
    return this.announcementsService.findAll(searchDto);
  }

  @Get('urgent')
  getUrgent() {
    return this.announcementsService.getUrgent();
  }

  @Get('my')
  @Auth([userrole_role.EXECUTOR])
  findMyAnnouncements(@Request() req) {
    return this.announcementsService.findByExecutor(req.user.id);
  }

  @Get('category/:category')
  searchByCategory(@Param('category') category: string) {
    return this.announcementsService.searchByCategory(category);
  }

  @Get('region/:region')
  searchByRegion(@Param('region') region: string) {
    return this.announcementsService.searchByRegion(region);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @Auth([userrole_role.EXECUTOR])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ) {
    return this.announcementsService.update(id, req.user.id, updateAnnouncementDto);
  }

  @Patch(':id/hide')
  @Auth([userrole_role.EXECUTOR])
  hide(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.announcementsService.hide(id, req.user.id);
  }

  @Patch(':id/show')
  @Auth([userrole_role.EXECUTOR])
  show(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.announcementsService.show(id, req.user.id);
  }

  @Delete(':id')
  @Auth([userrole_role.EXECUTOR])
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.announcementsService.remove(id, req.user.id);
  }
}
