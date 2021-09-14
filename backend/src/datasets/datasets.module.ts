import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../db/entities/Category';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Category])],
  controllers: [DatasetsController],
  providers: [DatasetsService],
})
export class DatasetsModule {}
