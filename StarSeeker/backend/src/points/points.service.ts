import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map, Observable } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

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
    const pointDataset = await this.pointDatasetRepository.findOne(datasetId);

    const url = `${process.env.ORION_URI}/v2/op/query`;

    const data: OpQuery = {
      entities: [
        {
          idPattern: '.*',
          type: pointDataset.entityType,
        },
      ],
      attrs: [
        pointDataset.coordinatesAttribute,
        pointDataset.registerTimeAttribute,
      ],
    };

    const config: AxiosRequestConfig = {
      params: {
        limit: limit,
      },
    };

    return this.httpService
      .post(url, data, config)
      .pipe(map((res) => res.data));
  }

  async getDetails(datasetId: number, entityId: string): Promise<any> {
    const details = await this.pointDetailRepository
      .createQueryBuilder('pointDetail')
      .leftJoin('pointDetail.pointDataset', 'pointDataset')
      .where('pointDataset.id = :datasetId', { datasetId })
      .getMany();

    const url = `${process.env.ORION_URI}/v2/entities/${entityId}?options=keyValues`;

    const response = await this.httpService.get(url).toPromise();

    const results = [];
    for (const detail of details) {
      const attribute = detail.itemAttribute;
      const result: { [key: string]: any } = {
        ...detail,
        value: response.data[attribute],
      };
      results.push(result);
    }

    return results;
  }
}
