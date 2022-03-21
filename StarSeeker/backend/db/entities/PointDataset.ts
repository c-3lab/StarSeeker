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

@Index('t_point_dataset_pkey', ['id'], { unique: true })
@Entity('t_point_dataset')
export class PointDataset {
  @Column('integer', { primary: true, name: 'point_dataset_id' })
  id: number;

  @Column('character varying', { name: 'point_dataset_name', length: 50 })
  name: string;

  @Column('character varying', { name: 'point_color_code', length: 32 })
  color: string;

  @Column('character varying', { name: 'entity_type', length: 50 })
  entityType: string;

  @Column('character varying', { name: 'coordinates_attr_name', length: 50 })
  coordinatesAttribute: string;

  @Column('character varying', { name: 'register_time_attr_name', length: 50 })
  registerTimeAttribute: string;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @ManyToOne(() => Category, (category) => category.pointDatasets)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  @OneToMany(() => PointDetail, (pointDetail) => pointDetail.pointDataset)
  pointDetails: PointDetail[];
}
