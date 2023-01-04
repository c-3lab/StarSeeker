import { Controller, Headers, Get, Param, Query } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { SurfacesService } from './surfaces.service';

@ApiTags('StarSeeker')
@Controller('surfaces')
export class SurfacesController {
  constructor(private readonly surfacesService: SurfacesService) {}

  @Get(':datasetId/entities')
  @ApiHeader({ name: 'fiware-service', description: 'Tenant' })
  @ApiHeader({ name: 'fiware-servicepath', description: 'Service path' })
  @ApiResponse({
    status: 200,
    description: 'Surface entitites of NGSIv2 format',
  })
  async getEntities(
    @Param('datasetId') datasetId: number,
    @Query('limit') limit?: number,
    @Headers('fiware-service') tenant?: string,
    @Headers('fiware-servicepath') path?: string,
  ): Promise<Observable<any>> {
    return this.surfacesService.getEntities(datasetId, limit, tenant, path);
  }

  @Get(':datasetId/:entityId/details')
  @ApiHeader({ name: 'fiware-service', description: 'Tenant' })
  @ApiHeader({ name: 'fiware-servicepath', description: 'Service path' })
  @ApiResponse({
    status: 200,
    description: 'Data for displaying surface details',
  })
  async getDetails(
    @Param('datasetId') datasetId: number,
    @Param('entityId') entityId: string,
    @Headers('fiware-service') tenant?: string,
    @Headers('fiware-servicepath') path?: string,
  ): Promise<any> {
    return this.surfacesService.getDetails(datasetId, entityId, tenant, path);
  }
}
