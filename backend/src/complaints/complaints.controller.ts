import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Request
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, ResolveComplaintDto } from './dto/create-complaint.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Auth()
  create(
    @Request() req,
    @Body() createComplaintDto: CreateComplaintDto
  ) {
    return this.complaintsService.create(req.user.id, createComplaintDto);
  }

  @Get()
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  findAll(@Request() req) {
    return this.complaintsService.findAll(req.user.id);
  }

  @Get('pending')
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  findPending() {
    return this.complaintsService.findPending();
  }

  @Get('my')
  @Auth()
  findMyComplaints(@Request() req) {
    return this.complaintsService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complaintsService.findOne(id);
  }

  @Patch(':id/assign')
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  assignToMe(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.complaintsService.assignToManager(id, req.user.id);
  }

  @Patch(':id/resolve')
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() resolveDto: ResolveComplaintDto
  ) {
    return this.complaintsService.resolve(id, req.user.id, resolveDto);
  }

  @Patch(':id/reject')
  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body('reason') reason: string
  ) {
    return this.complaintsService.reject(id, req.user.id, reason);
  }
}
