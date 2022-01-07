import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { SurfaceDataset } from './SurfaceDataset';

@Index('t_surface_detail_pkey', ['id'], { unique: true })
@Entity('t_surface_detail', { orderBy: { displayOrder: 'ASC' } })
export class SurfaceDetail {
  @Column('integer', { primary: true, name: 'surface_detail_id' })
  id: number;

  @Column('integer', { name: 'display_order' })
  displayOrder: number;

  @Column('character varying', { name: 'item_attr_name', length: 50 })
  itemAttribute: string;

  @Column('boolean', { name: 'enabled' })
  enabled: boolean;

  @Column('character varying', { name: 'display_title', length: 50 })
  displayTitle: string;

  @ManyToOne(
    () => SurfaceDataset,
    (surfaceDataset) => surfaceDataset.surfaceDetails,
  )
  @JoinColumn([{ name: 'surface_dataset_id', referencedColumnName: 'id' }])
  surfaceDataset: SurfaceDataset;
}
