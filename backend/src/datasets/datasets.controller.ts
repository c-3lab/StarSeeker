import { Controller, Param, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { DatasetsService } from './datasets.service';
import { Category } from '../../db/entities/Category';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'find a dataset list from a management database',
  })
  getDataSets(): Promise<Category[]> {
    return this.datasetsService.getDatasets();
  }
}
