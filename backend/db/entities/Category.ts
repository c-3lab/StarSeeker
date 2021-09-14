import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PointDataset } from './PointDataset';
import { SurfaceDataset } from './SurfaceDataset';

@Index('t_category_pkey', ['categoryId'], { unique: true })
@Entity('t_category', { schema: 'public' })
export class Category {
  @Column('integer', { primary: true, name: 'category_id' })
  categoryId: number;

  @Column('character varying', { name: 'category_name', length: 20 })
  categoryName: string;

  @Column('character varying', { name: 'category_color', length: 7 })
  categoryColor: string;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @OneToMany(() => PointDataset, (pointDataset) => pointDataset.category)
  pointDatasets: PointDataset[];

  @OneToMany(() => SurfaceDataset, (surfaceDataset) => surfaceDataset.category)
  surfaceDatasets: SurfaceDataset[];
}
