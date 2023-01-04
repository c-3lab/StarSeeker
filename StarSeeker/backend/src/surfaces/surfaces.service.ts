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
    tenantName?: string,
    servicePathName?: string,
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

    const headers = {
      'fiware-service': tenantName,
      'fiware-servicepath': servicePathName,
    };
    if (!tenantName) {
      delete headers['fiware-service'];
    }
    if (!servicePathName) {
      delete headers['fiware-servicepath'];
    }

    const config: AxiosRequestConfig = {
      headers: headers,
      params: {
        limit: limit,
      },
    };

    console.log('url: ' + JSON.stringify(url));
    console.log('data: ' + JSON.stringify(data));
    console.log('config: ' + JSON.stringify(config));
    return this.httpService
      .post(url, data, config)
      .pipe(map((res) => res.data));
  }

  async getDetails(
    datasetId: number,
    entityId: string,
    tenantName?: string,
    servicePathName?: string,
  ): Promise<any> {
    const details = await this.surfaceDetailRepository
      .createQueryBuilder('surfaceDetail')
      .leftJoin('surfaceDetail.surfaceDataset', 'surfaceDataset')
      .where('surfaceDataset.id = :datasetId', { datasetId })
      .getMany();

    const url = `${process.env.ORION_URI}/v2/entities/${entityId}?options=keyValues`;

    const headers = {
      'fiware-service': tenantName,
      'fiware-servicepath': servicePathName,
    };
    if (!tenantName) {
      delete headers['fiware-service'];
    }
    if (!servicePathName) {
      delete headers['fiware-servicepath'];
    }

    const config: AxiosRequestConfig = {
      headers: headers,
    };

    console.log('url: ' + JSON.stringify(url));
    console.log('config: ' + JSON.stringify(config));
    const response = await this.httpService.get(url, config).toPromise();

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
