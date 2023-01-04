import { Controller, Headers, Get, Param, Query } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { PointsService } from './points.service';

@ApiTags('StarSeeker')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get(['/entities', ':datasetId/entities'])
  @ApiHeader({ name: 'fiware-service', description: 'Tenant' })
  @ApiHeader({ name: 'fiware-servicepath', description: 'Service path' })
  @ApiResponse({
    status: 200,
    description: 'Point entities of NGSIv2 format',
  })
  async getEntities(
    @Param('datasetId') datasetId?: number,
    @Query('limit') limit?: number,
    @Query('q') q?: string,
    @Headers('fiware-service') tenant?: string,
    @Headers('fiware-servicepath') path?: string,
  ): Promise<Observable<any>> {
    return this.pointsService.getEntities(datasetId, limit, q, tenant, path);
  }

  @Get(':datasetId/:entityId/details')
  @ApiHeader({ name: 'fiware-service', description: 'Tenant' })
  @ApiHeader({ name: 'fiware-servicepath', description: 'Service path' })
  @ApiResponse({
    status: 200,
    description: 'Data for displaying point details',
  })
  async getDetails(
    @Param('datasetId') datasetId: number,
    @Param('entityId') entityId: string,
    @Headers('fiware-service') tenant?: string,
    @Headers('fiware-servicepath') path?: string,
  ): Promise<any> {
    return this.pointsService.getDetails(datasetId, entityId, tenant, path);
  }
}
