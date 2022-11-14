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

    let categories
    if (!tenantName) {
      if (!servicePathName) {
        categories = await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.servicePath', 'servicePath')
          .leftJoinAndSelect('servicePath.tenant', 'tenant')
          .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
          .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
          .where('servicePath.name IS NULL')
          .andWhere('tenant.name IS NULL')
          .andWhere('category.enabled = true')
          .andWhere(new Brackets(queryOr => {
	    queryOr.where('pointDataset.enabled = true')
	      .orWhere('surfaceDataset.enabled = true')
	    }))
          .getMany()
      } else {
        categories = await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.servicePath', 'servicePath')
          .leftJoinAndSelect('servicePath.tenant', 'tenant')
          .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
          .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
          .where('servicePath.name = :servicePathName', { servicePathName: servicePathName })
          .andWhere('tenant.name IS NULL')
          .andWhere('category.enabled = true')
          .andWhere(new Brackets(queryOr => {
	    queryOr.where('pointDataset.enabled = true')
	      .orWhere('surfaceDataset.enabled = true')
	    }))
          .getMany()
      }
    } else {
      if (!servicePathName) {
        categories = await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.servicePath', 'servicePath')
          .leftJoinAndSelect('servicePath.tenant', 'tenant')
          .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
          .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
          .where('servicePath.name IS NULL')
          .andWhere('tenant.name = :tenantName', { tenantName: tenantName })
          .andWhere('category.enabled = true')
          .andWhere(new Brackets(queryOr => {
	    queryOr.where('pointDataset.enabled = true')
	      .orWhere('surfaceDataset.enabled = true')
	    }))
          .getMany()
      } else {
        categories = await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.servicePath', 'servicePath')
          .leftJoinAndSelect('servicePath.tenant', 'tenant')
          .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
          .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
          .where('servicePath.name = :servicePathName', { servicePathName: servicePathName })
          .andWhere('tenant.name = :tenantName', { tenantName: tenantName })
          .andWhere('category.enabled = true')
          .andWhere(new Brackets(queryOr => {
	    queryOr.where('pointDataset.enabled = true')
	      .orWhere('surfaceDataset.enabled = true')
	    }))
          .getMany()
      }
    }
    return categories
  }
}
