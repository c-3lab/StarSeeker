import { Controller, Param, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DatasetsService } from './datasets.service';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get(':datasetId/entities')
  @ApiResponse({
    status: 200,
    description: 'find orion data',
  })
  getEntities(
    @Param('datasetId') datasetId: string,
    @Query('limit') limit?: number,
  ): Observable<any> {
    return this.datasetsService.getEntities(datasetId, limit);
  }
}
