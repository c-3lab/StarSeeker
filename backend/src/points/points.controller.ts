import { Controller, Param, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get(':datasetId/entities')
  @ApiResponse({
    status: 200,
    description: 'Point entities of NGSIv2 format',
  })
  async getEntities(
    @Param('datasetId') datasetId: number,
    @Query('limit') limit?: number,
  ): Promise<Observable<any>> {
    return this.pointsService.getEntities(datasetId, limit);
  }

  @Get(':datasetId/:entityId/details')
  @ApiResponse({
    status: 200,
    description: 'Data for displaying point details',
  })
  async getDetails(
    @Param('datasetId') datasetId: number,
    @Param('entityId') entityId: string,
  ): Promise<any> {
    return this.pointsService.getDetails(datasetId, entityId);
  }
}
