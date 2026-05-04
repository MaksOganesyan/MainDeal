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
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto, AssignExecutorDto, SearchDealDto, CalculatePriceDto } from './dto/create-deal.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Auth([userrole_role.CUSTOMER])
  @Post()
  create(@Request() req, @Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(req.user.id, createDealDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchDealDto) {
    return this.dealsService.findAll(searchDto);
  }

  @Get('search/urgent')
  findUrgent() {
    const searchDto = new SearchDealDto();
    searchDto.isUrgent = true;
    return this.dealsService.findAll(searchDto);
  }

  @Get('search/region/:region')
  findByRegion(@Param('region') region: string) {
    const searchDto = new SearchDealDto();
    searchDto.region = region;
    return this.dealsService.findAll(searchDto);
  }

  @Auth([userrole_role.CUSTOMER])
  @Get('my')
  findMyDeals(@Request() req) {
    return this.dealsService.findByCustomer(req.user.id);
  }

  @Auth([userrole_role.EXECUTOR])
  @Get('executor')
  findExecutorDeals(@Request() req) {
    return this.dealsService.findByExecutor(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dealsService.findOne(id);
  }

  @Auth([userrole_role.CUSTOMER])
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateDealDto: UpdateDealDto
  ) {
    return this.dealsService.update(id, req.user.id, updateDealDto);
  }

  @Auth([userrole_role.CUSTOMER])
  @Post(':id/assign-executor')
  assignExecutor(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() assignExecutorDto: AssignExecutorDto
  ) {
    return this.dealsService.assignExecutor(id, req.user.id, assignExecutorDto);
  }

  @Auth([userrole_role.EXECUTOR])
  @Post(':id/complete')
  completeDeal(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.dealsService.completeDeal(id, req.user.id);
  }

  @Auth([userrole_role.CUSTOMER, userrole_role.ADMIN])
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.dealsService.remove(id, req.user.id);
  }

  @Auth([userrole_role.CUSTOMER])
  @Get('history/customer')
  getCustomerHistory(@Request() req) {
    return this.dealsService.getCustomerHistory(req.user.id);
  }

  @Auth([userrole_role.EXECUTOR])
  @Get('history/executor')
  getExecutorHistory(@Request() req) {
    return this.dealsService.getExecutorHistory(req.user.id);
  }

  @Post('calculate-price')
  calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
    return this.dealsService.calculatePrice(calculatePriceDto);
  }
}
