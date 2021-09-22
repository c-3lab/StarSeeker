import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Category } from '../../db/entities/Category';

@Injectable()
export class DatasetsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getDatasets(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
      .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
      .where('category.enabled = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('pointDataset.enabled = true').orWhere(
            'surfaceDataset.enabled = true',
          );
        }),
      )
      .orderBy('category.displayOrder', 'ASC')
      .getMany();
  }
}
