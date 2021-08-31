import { Controller, Param, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { FeatureCollection } from './entities/points.entity';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get(':type')
  @ApiResponse({
    status: 200,
    description: 'Points of GeoJSON format',
  })
  async getPoints(
    @Param('type') type: string,
    @Query('limit') limit?: number,
  ): Promise<FeatureCollection> {
    return await this.pointsService.getPoints(type, limit);
  }
}
