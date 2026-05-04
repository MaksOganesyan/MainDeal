import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioItemDto } from './create-portfolio.dto';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioItemDto) {}
