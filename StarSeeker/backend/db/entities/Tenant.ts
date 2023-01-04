import { Column, PrimaryGeneratedColumn, Entity, Index, Unique, OneToMany } from 'typeorm';
import { ServicePath } from './ServicePath';

@Index('t_tenant_pkey', ['id'], { unique: true })
@Entity('t_tenant', { orderBy: { id: 'ASC' } })
@Unique(['name'])
export class Tenant {
  @PrimaryGeneratedColumn({ name: 'tenant_id' })
  id: number;

  @Column('character varying', { name: 'tenant_name', length: 50, nullable: true })
  name: string;

  @OneToMany(() => ServicePath, (servicePath) => servicePath.tenant)
  servicePaths: ServicePath[];

}
