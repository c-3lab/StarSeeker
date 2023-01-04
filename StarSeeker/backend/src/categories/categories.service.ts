import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, Brackets } from 'typeorm';

import { Category } from '../../db/entities/Category';
import { ServicePath } from '../../db/entities/ServicePath';
import { Tenant } from '../../db/entities/Tenant';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ServicePath)
    private servicePathRepository: Repository<ServicePath>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async getCategories(
    tenantName: string,
    servicePathName: string,
  ): Promise<Category[]> {
    let query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.servicePath', 'servicePath')
      .leftJoinAndSelect('servicePath.tenant', 'tenant')
      .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
      .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset');

    if (!tenantName) {
      query = query.where('tenant.name IS NULL');
    } else {
      query = query.where('tenant.name = :tenantName', {
        tenantName: tenantName,
      });
    }

    if (!servicePathName) {
      query = query.andWhere('servicePath.name IS NULL');
    } else {
      query = query.andWhere('servicePath.name = :servicePathName', {
        servicePathName: servicePathName,
      });
    }

    const categories = await query
      .andWhere('category.enabled = true')
      .andWhere(
        new Brackets((queryOr) => {
          queryOr
            .where('pointDataset.enabled = true')
            .orWhere('surfaceDataset.enabled = true');
        }),
      )
      .getMany();

    return categories;
  }
}
