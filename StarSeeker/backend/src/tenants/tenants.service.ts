import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tenant } from '../../db/entities/Tenant';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  getTenants(tenant: string, path: string): Promise<Tenant[]> {
    if (tenant != null) {
      if (path != null) {
        return this.tenantRepository
          .createQueryBuilder('tenant')
          .leftJoinAndSelect('tenant.servicePaths', 'servicePath')
          .where('tenant.name = :tenant', { tenant })
          .andWhere('servicePath.name = :path', { path })
          .getMany();
      } else {
        return this.tenantRepository
          .createQueryBuilder('tenant')
          .leftJoinAndSelect('tenant.servicePaths', 'servicePath')
          .where('tenant.name = :tenant', { tenant })
          .andWhere('servicePath.name IS NULL')
          .getMany();
      }
    } else {
      if (path != null) {
        return this.tenantRepository
          .createQueryBuilder('tenant')
          .leftJoinAndSelect('tenant.servicePaths', 'servicePath')
          .where('tenant.name IS NULL')
          .andWhere('servicePath.name = :path', { path })
          .getMany();
      } else {
        return this.tenantRepository
          .createQueryBuilder('tenant')
          .leftJoinAndSelect('tenant.servicePaths', 'servicePath')
          .where('tenant.name IS NULL')
          .andWhere('servicePath.name IS NULL')
          .getMany();
      }
    }
  }
}
