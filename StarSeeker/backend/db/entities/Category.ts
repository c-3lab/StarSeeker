import { Column, PrimaryGeneratedColumn, Entity, Index, Unique, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { PointDataset } from './PointDataset';
import { SurfaceDataset } from './SurfaceDataset';
import { ServicePath } from './ServicePath';

@Index('t_category_pkey', ['id'], { unique: true })
@Entity('t_category', { orderBy: { displayOrder: 'ASC' } })
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column('character varying', { name: 'category_name', length: 50 })
  name: string;

  @Column('character varying', { name: 'category_color', length: 32 })
  color: string;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @ManyToOne(() => ServicePath, (servicePath) => servicePath.categories, { nullable: false })
  @JoinColumn({ name: 'service_path_id' })
  servicePath: ServicePath;

  @OneToMany(() => PointDataset, (pointDataset) => pointDataset.category)
  pointDatasets: PointDataset[];

  @OneToMany(() => SurfaceDataset, (surfaceDataset) => surfaceDataset.category)
  surfaceDatasets: SurfaceDataset[];

}
