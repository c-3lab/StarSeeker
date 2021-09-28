import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../../db/entities/Category';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getDatasets(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
      .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
      .where('category.enabled = true')
      .andWhere('pointDataset.enabled = true or surfaceDataset.enabled = true')
      .getMany();
  }
}
