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
    let query = this.tenantRepository
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.servicePaths', 'servicePath');

    if (!tenant) {
      query = query.where('tenant.name IS NULL');
    } else {
      query = query.where('tenant.name = :tenant', { tenant });
    }

    if (!path) {
      query = query.andWhere('servicePath.name IS NULL');
    } else {
      query = query.andWhere('servicePath.name = :path', { path });
    }

    const tenants = query.getMany();

    return tenants;
  }
}
