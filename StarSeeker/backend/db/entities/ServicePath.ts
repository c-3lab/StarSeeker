import { Column, PrimaryGeneratedColumn, Entity, Index, Unique, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './Category';
import { Tenant } from './Tenant';

@Index('t_service_path_pkey', ['id'], { unique: true })
@Entity('t_service_path', { orderBy: { id: 'ASC' } })
@Unique(['name', 'tenant'])
export class ServicePath {
  @PrimaryGeneratedColumn({ name: 'service_path_id' })
  id: number;

  @Column('character varying', { name: 'service_path_name', length: 550, nullable: true })
  name: string;

  @OneToMany(() => Category, (category) => category.servicePath)
  categories: Category[];

  @ManyToOne(() => Tenant, (tenant) => tenant.servicePaths, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

}
