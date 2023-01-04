import { Controller, Headers, Get } from '@nestjs/common';
import { ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { Category } from '../../db/entities/Category';

@ApiTags('StarSeeker')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiHeader({ name: 'fiware-service', description: 'Tenant' })
  @ApiHeader({ name: 'fiware-servicepath', description: 'Service path' })
  @ApiResponse({
    status: 200,
    description: 'find a dataset list from a management database',
  })
  getCategories(
    @Headers('fiware-service') tenant,
    @Headers('fiware-servicepath') path,
  ): Promise<Category[]> {
    return this.categoriesService.getCategories(tenant, path);
  }
}
