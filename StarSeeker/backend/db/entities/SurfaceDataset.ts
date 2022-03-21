import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './Category';
import { SurfaceDetail } from './SurfaceDetail';

@Index('t_surface_dataset_pkey', ['id'], { unique: true })
@Entity('t_surface_dataset')
export class SurfaceDataset {
  @Column('integer', { primary: true, name: 'surface_dataset_id' })
  id: number;

  @Column('character varying', { name: 'surface_dataset_name', length: 50 })
  name: string;

  @Column('character varying', { name: 'border_color_code', length: 32 })
  borderColor: string;

  @Column('character varying', { name: 'fill_color_code', length: 32 })
  fillColor: string;

  @Column('character varying', { name: 'entity_type', length: 50 })
  entityType: string;

  @Column('character varying', { name: 'coordinates_attr_name', length: 50 })
  coordinatesAttribute: string;

  @Column('character varying', { name: 'register_time_attr_name', length: 50 })
  registerTimeAttribute: string;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @ManyToOne(() => Category, (category) => category.surfaceDatasets)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  @OneToMany(
    () => SurfaceDetail,
    (surfaceDetail) => surfaceDetail.surfaceDataset,
  )
  surfaceDetails: SurfaceDetail[];
}
