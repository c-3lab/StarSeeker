import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { map, Observable } from 'rxjs';
import { Category } from '../../db/entities/Category';

import { manageDbDataSample } from './dat/datasets.sample.dat';
import { OpQuery } from './interfaces/datasets.interface';

@Injectable()
export class DatasetsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getDatasets(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.pointDatasets', 'pointDataset')
      .leftJoinAndSelect('category.surfaceDatasets', 'surfaceDataset')
      .where('category.enabled = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('pointDataset.enabled = true').orWhere(
            'surfaceDataset.enabled = true',
          );
        }),
      )
      .getMany();
  }

  getEntities(datasetId: string, limit?: number): Observable<any> {
    const datasetParam = manageDbDataSample.find(
      (e) => String(e.datasetId) === datasetId,
    );
    const type = datasetParam.type;
    const url = `${process.env.ORION_URI}/v2/op/query${
      limit ? '?limit=' + limit : ''
    }`;

    const entities = [
      {
        idPattern: '.*',
        type: type,
      },
    ];

    const attrs = [
      datasetParam.coordinatesFieldName,
      datasetParam.locationNameFieldName,
      datasetParam.timeFieldName,
    ];

    const OpQuery: OpQuery = {
      entities: entities,
      attrs: attrs,
    };

    return this.httpService.post(url, OpQuery).pipe(map((res) => res.data));
  }
}
