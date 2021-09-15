import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { PointDataset } from '../../db/entities/PointDataset';
import { PointDetail } from '../../db/entities/PointDetail';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([PointDataset, PointDetail])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
