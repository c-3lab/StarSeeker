import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { OpQuery } from './interfaces/entities.interface';

@Injectable()
export class EntitiesService {
  constructor(private httpService: HttpService) {}

  getDetails(datasetId: string, entityId: string): Observable<any> {
    const url = `${process.env.ORION_URI}/v2/op/query`;
    const entities = [
      {
        id: entityId,
      },
    ];

    const attrs = ['address', 'locationName'];

    const OpQuery: OpQuery = {
      entities,
      attrs,
    };

    return this.httpService.post(url, OpQuery).pipe(map((res) => res.data));
  }
}
