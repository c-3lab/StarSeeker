import { Controller, Headers, Get } from '@nestjs/common';
import { ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';

import { TenantsService } from './tenants.service';
import { Tenant } from '../../db/entities/Tenant';

@ApiTags('StarSeeker')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiHeader({ name: 'fiware-service', description: 'Tenant' })
  @ApiHeader({ name: 'fiware-servicepath', description: 'Service path' })
  @ApiResponse({
    status: 200,
    description:
      'find a tenant and service path list from a management database',
  })
  getTenants(
    @Headers('fiware-service') tenant,
    @Headers('fiware-servicepath') path,
  ): Promise<Tenant[]> {
    return this.tenantsService.getTenants(tenant, path);
  }
}
