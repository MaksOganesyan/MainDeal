import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { DealResponsesService } from './deal-responses.service';
import { CreateDealResponseDto, UpdateResponseStatusDto } from './dto/create-response.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('deal-responses')
export class DealResponsesController {
  constructor(private readonly dealResponsesService: DealResponsesService) {}

  // Create response (executor only)
  @Auth([userrole_role.EXECUTOR])
  @Post()
  createResponse(@Request() req, @Body() dto: CreateDealResponseDto) {
    return this.dealResponsesService.createResponse(req.user.id, dto);
  }

  // Get executor's responses
  @Auth([userrole_role.EXECUTOR])
  @Get('my')
  getMyResponses(@Request() req) {
    return this.dealResponsesService.getExecutorResponses(req.user.id);
  }

  // Get responses for a deal (customer only)
  @Auth([userrole_role.CUSTOMER])
  @Get('deal/:dealId')
  getDealResponses(@Request() req, @Param('dealId', ParseIntPipe) dealId: number) {
    return this.dealResponsesService.getDealResponses(dealId, req.user.id);
  }

  // Accept response (customer only)
  @Auth([userrole_role.CUSTOMER])
  @Patch(':id/accept')
  acceptResponse(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.dealResponsesService.acceptResponse(id, req.user.id);
  }

  // Reject response (customer only)
  @Auth([userrole_role.CUSTOMER])
  @Patch(':id/reject')
  rejectResponse(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResponseStatusDto,
  ) {
    return this.dealResponsesService.rejectResponse(id, req.user.id, dto);
  }

  // Withdraw response (executor only)
  @Auth([userrole_role.EXECUTOR])
  @Delete(':id')
  withdrawResponse(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.dealResponsesService.withdrawResponse(id, req.user.id);
  }
}
