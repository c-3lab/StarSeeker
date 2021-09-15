import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, Observable } from 'rxjs';

import { OpQuery } from './interfaces/points.interface';
import { PointDataset } from '../../db/entities/PointDataset';
import { PointDetail } from '../../db/entities/PointDetail';

@Injectable()
export class PointsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(PointDataset)
    private pointDatasetRepository: Repository<PointDataset>,
    @InjectRepository(PointDetail)
    private pointDetailRepository: Repository<PointDetail>,
  ) {}

  async getEntities(
    datasetId: number,
    limit?: number,
  ): Promise<Observable<any>> {
    const pointDataset = await this.pointDatasetRepository.findOne({
      pointDatasetId: datasetId,
    });

    const entitiyType = pointDataset.entityType;

    const url = `${process.env.ORION_URI}/v2/op/query${
      limit ? '?limit=' + limit : ''
    }`;

    const entities = [
      {
        idPattern: '.*',
        type: entitiyType,
      },
    ];

    const attrs = [
      pointDataset.coordinatesAttrName,
      pointDataset.registerTimeAttrName,
    ];

    const OpQuery: OpQuery = {
      entities: entities,
      attrs: attrs,
    };

    return this.httpService.post(url, OpQuery).pipe(map((res) => res.data));
  }

  async getDetails(datasetId: number, entityId: string): Promise<any> {
    const pointDetails = await this.pointDetailRepository
      .createQueryBuilder('pointDetail')
      .leftJoin('pointDetail.pointDataset', 'pointDataset')
      .where('pointDataset.pointDatasetId = :datasetId', { datasetId })
      .orderBy('pointDetail.displayOrder', 'ASC')
      .getMany();

    const url = `${process.env.ORION_URI}/v2/op/query`;

    const entities = [
      {
        id: entityId,
        typePattern: '.*',
      },
    ];

    const attrs = pointDetails.map((pointDetail) => pointDetail.itemAttrName);

    const OpQuery: OpQuery = {
      entities: entities,
      attrs: attrs,
    };

    const res = await this.httpService.post(url, OpQuery).toPromise();
    const data = res.data[0];

    const results = [];
    for (const pointDetail of pointDetails) {
      const itemAttrName: keyof { [key: string]: any } =
        pointDetail.itemAttrName as keyof { [key: string]: any };
      const obj: { [key: string]: any } = {};
      obj.displayOrder = pointDetail.displayOrder;
      obj.dataType = pointDetail.dataType;
      obj.displayTitle = pointDetail.displayTitle;
      obj.value = data[itemAttrName].value;
      results.push(obj);
    }

    return results;
  }
}
