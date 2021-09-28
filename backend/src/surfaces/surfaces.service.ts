import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { AxiosRequestConfig } from 'axios';

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
    const surfaceDataset = await this.surfaceDatasetRepository.findOne(
      datasetId,
    );

    const url = `${process.env.ORION_URI}/v2/op/query`;

    const data: OpQuery = {
      entities: [
        {
          idPattern: '.*',
          type: surfaceDataset.entityType,
        },
      ],
      attrs: [
        surfaceDataset.coordinatesAttribute,
        surfaceDataset.registerTimeAttribute,
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
    const details = await this.surfaceDetailRepository
      .createQueryBuilder('surfaceDetail')
      .leftJoin('surfaceDetail.surfaceDataset', 'surfaceDataset')
      .where('surfaceDataset.id = :datasetId', { datasetId })
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
