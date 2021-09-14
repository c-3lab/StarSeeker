import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './Category';
import { PointDetail } from './PointDetail';

@Index('t_point_dataset_pkey', ['pointDatasetId'], { unique: true })
@Entity('t_point_dataset', { schema: 'public' })
export class PointDataset {
  @Column('integer', { primary: true, name: 'point_dataset_id' })
  pointDatasetId: number;

  @Column('character varying', { name: 'point_dataset_name', length: 50 })
  pointDatasetName: string;

  @Column('character varying', { name: 'point_color_code', length: 7 })
  pointColorCode: string;

  @Column('character varying', { name: 'entity_type', length: 50 })
  entityType: string;

  @Column('character varying', { name: 'coordinates_attr_name', length: 50 })
  coordinatesAttrName: string;

  @Column('character varying', { name: 'register_time_attr_name', length: 50 })
  registerTimeAttrName: string;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @ManyToOne(() => Category, (category) => category.pointDatasets)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'categoryId' }])
  category: Category;

  @OneToMany(() => PointDetail, (pointDetail) => pointDetail.pointDataset)
  pointDetails: PointDetail[];
}
