import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PointDataset } from './PointDataset';

@Index('t_point_detail_pkey', ['pointDetailId'], { unique: true })
@Entity('t_point_detail', { schema: 'public' })
export class PointDetail {
  @Column('integer', { primary: true, name: 'point_detail_id' })
  pointDetailId: number;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('character varying', { name: 'item_attr_name', length: 50 })
  itemAttrName: string;

  @Column('integer', { name: 'data_type' })
  dataType: number;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @Column('character varying', { name: 'display_title', length: 50 })
  displayTitle: string;

  @ManyToOne(() => PointDataset, (pointDataset) => pointDataset.pointDetails)
  @JoinColumn([
    { name: 'point_dataset_id', referencedColumnName: 'pointDatasetId' },
  ])
  pointDataset: PointDataset;
}
