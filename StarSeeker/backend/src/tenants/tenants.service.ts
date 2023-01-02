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

    const query0 = this.tenantRepository
          .createQueryBuilder('tenant')
	  .leftJoinAndSelect('tenant.servicePaths', 'servicePath');

    let query1
    if (!tenant) {
        query1 = query0.where('tenant.name IS NULL')
    } else {
        query1 = query0.where('tenant.name = :tenant', { tenant })
    }

    let query2
    if (!path) {
        query2 = query1.andWhere('servicePath.name IS NULL')
    } else {
        query2 = query1.andWhere('servicePath.name = :path', { path })
    }

    const tenants = query2.getMany();

    return tenants;

  }
}
