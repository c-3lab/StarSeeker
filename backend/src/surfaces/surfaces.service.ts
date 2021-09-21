import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { Repository } from 'typeorm';

import { OpQuery } from './interfaces/surfaces.interface';
import { SurfaceDataset } from '../../db/entities/SurfaceDataset';
import { SurfaceDetail } from '../../db/entities/SurfaceDetail';

@Injectable()
export class SurfacesService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(SurfaceDataset)
    private surfaceDatasetRepository: Repository<SurfaceDataset>,
    @InjectRepository(SurfaceDetail)
    private surfaceDetailRepository: Repository<SurfaceDetail>,
  ) {}

  async getEntities(
    datasetId: number,
    limit?: number,
  ): Promise<Observable<any>> {
    const surfaceDataset = await this.surfaceDatasetRepository.findOne({
      surfaceDatasetId: datasetId,
    });

    const entityType = surfaceDataset.entityType;

    const url = `${process.env.ORION_URI}/v2/op/query${
      limit ? '?limit=' + limit : ''
    }`;

    const entities = [
      {
        idPattern: '.*',
        type: entityType,
      },
    ];

    const attrs = [
      surfaceDataset.coordinatesAttrName,
      surfaceDataset.registerTimeAttrName,
    ];

    const OpQuery: OpQuery = {
      entities: entities,
      attrs: attrs,
    };

    return this.httpService.post(url, OpQuery).pipe(map((res) => res.data));
  }

  async getDetails(datasetId: number, entityId: string): Promise<any> {
    const surfaceDetails = await this.surfaceDetailRepository
      .createQueryBuilder('surfaceDetail')
      .leftJoin('surfaceDetail.surfaceDataset', 'surfaceDataset')
      .where('surfaceDataset.surfaceDatasetId = :datasetId', { datasetId })
      .orderBy('surfaceDetail.displayOrder', 'ASC')
      .getMany();

    const url = `${process.env.ORION_URI}/v2/op/query`;

    const entities = [
      {
        id: entityId,
        typePattern: '.*',
      },
    ];

    const attrs = surfaceDetails.map(
      (surfaceDetail) => surfaceDetail.itemAttrName,
    );

    const opQuery: OpQuery = {
      entities: entities,
      attrs: attrs,
    };

    const res = await this.httpService.post(url, opQuery).toPromise();
    const data = res.data[0];

    const results = [];
    for (const surfaceDetail of surfaceDetails) {
      const itemAttrName: keyof { [key: string]: any } =
        surfaceDetail.itemAttrName as keyof { [key: string]: any };
      const obj: { [key: string]: any } = {};
      obj.displayOrder = surfaceDetail.displayOrder;
      obj.displayTitle = surfaceDetail.displayTitle;
      obj.value = data[itemAttrName].value;
      results.push(obj);
    }

    return results;
  }
}
