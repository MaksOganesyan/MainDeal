import { Module, Global } from '@nestjs/common';
import { ContentFilterService } from './content-filter.service';

@Global()
@Module({
  providers: [ContentFilterService],
  exports: [ContentFilterService]
})
export class ContentFilterModule {}

