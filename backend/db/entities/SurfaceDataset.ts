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

@Index('t_surface_dataset_pkey', ['surfaceDatasetId'], { unique: true })
@Entity('t_surface_dataset', { schema: 'public' })
export class SurfaceDataset {
  @Column('integer', { primary: true, name: 'surface_dataset_id' })
  surfaceDatasetId: number;

  @Column('character varying', { name: 'surface_dataset_name', length: 50 })
  surfaceDatasetName: string;

  @Column('character varying', { name: 'border_color_code', length: 7 })
  borderColorCode: string;

  @Column('character varying', { name: 'fill_color_code', length: 50 })
  fillColorCode: string;

  @Column('character varying', { name: 'entity_type', length: 50 })
  entityType: string;

  @Column('character varying', { name: 'coordinates_attr_name', length: 50 })
  coordinatesAttrName: string;

  @Column('character varying', { name: 'register_time_attr_name', length: 50 })
  registerTimeAttrName: string;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @ManyToOne(() => Category, (category) => category.surfaceDatasets)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'categoryId' }])
  category: Category;

  @OneToMany(
    () => SurfaceDetail,
    (surfaceDetail) => surfaceDetail.surfaceDataset,
  )
  surfaceDetails: SurfaceDetail[];
}
