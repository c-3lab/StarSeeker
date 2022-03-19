import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PointDataset } from './PointDataset';
import { SurfaceDataset } from './SurfaceDataset';

@Index('t_category_pkey', ['id'], { unique: true })
@Entity('t_category', { orderBy: { displayOrder: 'ASC' } })
export class Category {
  @Column('integer', { primary: true, name: 'category_id' })
  id: number;

  @Column('character varying', { name: 'category_name', length: 50 })
  name: string;

  @Column('character varying', { name: 'category_color', length: 32 })
  color: string;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @OneToMany(() => PointDataset, (pointDataset) => pointDataset.category)
  pointDatasets: PointDataset[];

  @OneToMany(() => SurfaceDataset, (surfaceDataset) => surfaceDataset.category)
  surfaceDatasets: SurfaceDataset[];
}
