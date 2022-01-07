import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { SurfacesController } from './surfaces.controller';
import { SurfacesService } from './surfaces.service';
import { SurfaceDataset } from '../../db/entities/SurfaceDataset';
import { SurfaceDetail } from '../../db/entities/SurfaceDetail';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SurfaceDataset, SurfaceDetail]),
  ],
  controllers: [SurfacesController],
  providers: [SurfacesService],
})
export class SurfacesModule {}
