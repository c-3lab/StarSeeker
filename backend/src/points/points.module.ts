import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  imports: [HttpModule],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
