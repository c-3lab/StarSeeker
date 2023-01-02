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

  async getCategories(tenantName: string, servicePathName: string): Promise<Category[]> {

    const query0 = this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.servicePath', 'servicePath')
          .leftJoinAndSelect('servicePath.tenant', 'tenant')
          .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
          .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')

    let query1
    if (!tenantName) {
        query1 = query0.where('tenant.name IS NULL')
    } else {
        query1 = query0.where('tenant.name = :tenantName', { tenantName: tenantName })
    }

    let query2
    if (!servicePathName) {
        query2 = query1.andWhere('servicePath.name IS NULL')
    } else {
        query2 = query1.andWhere('servicePath.name = :servicePathName', { servicePathName: servicePathName })
    }

    const categories = await query2
      .andWhere('category.enabled = true')
      .andWhere(new Brackets(queryOr => {
        queryOr.where('pointDataset.enabled = true')
          .orWhere('surfaceDataset.enabled = true')
        }))
      .getMany()

    return categories
  }
}
