import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { manageDbDataSample } from './dat/datasets.sample.dat';
import { OpQuery } from './interfaces/datasets.interface';

@Injectable()
export class DatasetsService {
  constructor(private httpService: HttpService) {}

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
