import { Controller, Param, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { EntitiesService } from './entities.service';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get(':datasetId/:entityId/details')
  @ApiResponse({
    status: 200,
    description: 'find orion data',
  })
  getDetails(
    @Param('datasetId') datasetId: string,
    @Param('entityId') entityId: string,
  ): Observable<any> {
    return this.entitiesService.getDetails(datasetId, entityId);
  }
}
