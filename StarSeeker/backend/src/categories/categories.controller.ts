import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { Category } from '../../db/entities/Category';

@ApiTags('StarSeeker')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'find a dataset list from a management database',
  })
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }
}
