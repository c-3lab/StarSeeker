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
    datasetId?: number,
    limit?: number,
    q?: string,
    tenantName?: string,
    servicePathName?: string,
  ): Promise<Observable<any>> {
    const url = `${process.env.ORION_URI}/v2/op/query`;

    const data: OpQuery = {
      entities: [
        {
          idPattern: '.*',
        },
      ],
    };
    if (datasetId != null) {
      const pointDataset = await this.pointDatasetRepository.findOne(datasetId);
      data.attrs = [
        pointDataset.coordinatesAttribute,
        pointDataset.registerTimeAttribute,
      ];
      data.entities[0].type = pointDataset.entityType;
    }
    if (q != null) {
      data.expression = { q: q };
    }

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
    return this.httpService.post(url, data, config).pipe(
      map((res) => {
        return res.data;
      }),
    );
  }

  async getDetails(
    datasetId: number,
    entityId: string,
    tenantName?: string,
    servicePathName?: string,
  ): Promise<any> {
    const details = await this.pointDetailRepository
      .createQueryBuilder('pointDetail')
      .leftJoin('pointDetail.pointDataset', 'pointDataset')
      .where('pointDataset.id = :datasetId', { datasetId })
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
