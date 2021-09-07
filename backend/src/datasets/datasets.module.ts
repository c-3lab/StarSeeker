import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';

@Module({
  imports: [HttpModule],
  controllers: [DatasetsController],
  providers: [DatasetsService],
})
export class DatasetsModule {}
