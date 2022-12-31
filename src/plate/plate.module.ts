import { Module } from '@nestjs/common';
import { PlateService } from './plate.service';
import { PlateController } from './plate.controller';

@Module({
  providers: [PlateService],
  controllers: [PlateController]
})
export class PlateModule {}
