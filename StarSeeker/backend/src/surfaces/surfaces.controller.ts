import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { SurfacesService } from './surfaces.service';

@ApiTags('StarSeeker')
@Controller('surfaces')
export class SurfacesController {
  constructor(private readonly surfacesService: SurfacesService) {}

  @Get(':datasetId/entities')
  @ApiResponse({
    status: 200,
    description: 'Surface entitites of NGSIv2 format',
  })
  async getEntities(
    @Param('datasetId') datasetId: number,
    @Query('limit') limit?: number,
  ): Promise<Observable<any>> {
    return this.surfacesService.getEntities(datasetId, limit);
  }

  @Get(':datasetId/:entityId/details')
  @ApiResponse({
    status: 200,
    description: 'Data for displaying surface details',
  })
  async getDetails(
    @Param('datasetId') datasetId: number,
    @Param('entityId') entityId: string,
  ): Promise<any> {
    return this.surfacesService.getDetails(datasetId, entityId);
  }
}
