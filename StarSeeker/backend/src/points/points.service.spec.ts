import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';

import { PointsService } from './points.service';
import { PointDataset } from '../../db/entities/PointDataset';
import { PointDetail } from '../../db/entities/PointDetail';
import { Observable } from 'rxjs';

jest.mock('@nestjs/axios');

describe('PointsService', () => {
  let httpService: HttpService;
  let pointsService: PointsService;
  let pointDatasetRepository: Repository<PointDataset>;
  let pointDetailRepository: Repository<PointDetail>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PointsService,
        HttpService,
        {
          provide: getRepositoryToken(PointDataset),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PointDetail),
          useClass: Repository,
        },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    pointsService = module.get<PointsService>(PointsService);
    pointDatasetRepository = module.get(getRepositoryToken(PointDataset));
    pointDetailRepository = module.get(getRepositoryToken(PointDetail));
  });

  it('should be defined', () => {
    expect(pointsService).toBeDefined();
  });

  describe('getEntities', () => {
    it('should return array of orion entities', async () => {
      const testPointDataset: PointDataset = {
        id: 1,
        name: '公園',
        color: '#00E500',
        entityType: 'Park',
        coordinatesAttribute: 'location',
        registerTimeAttribute: 'time',
        enabled: true,
        category: {
          id: 1,
          name: '公共施設',
          color: '#00008B',
          displayOrder: 1,
          enabled: true,
          pointDatasets: [],
          surfaceDatasets: [],
          servicePath: {
            id: 1,
            name: '/path',
            categories: [],
            tenant: {
              id: 1,
              name: 'tenant',
              servicePaths: [],
            },
          },
        },
        pointDetails: [],
      };

      const testOrionData = [
        {
          id: 'ParkId001',
          type: 'Park',
          location: {
            type: 'geo:point',
            value: '35.9045568476736, 139.378167943858',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'ParkId002',
          type: 'Park',
          location: {
            type: 'geo:point',
            value: '35.8901393470751, 139.448973562127',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'ParkId003',
          type: 'Park',
          location: {
            type: 'geo:point',
            value: '36.0226681308094, 139.436079879839',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
      ];

      const testAxiosResponse: AxiosResponse<any> = {
        data: testOrionData,
        status: 200,
        statusText: '',
        headers: undefined,
        config: undefined,
      };

      const testObservable: Observable<AxiosResponse<any>> = new Observable(
        (subscriber) => {
          subscriber.next(testAxiosResponse);
        },
      );

      jest
        .spyOn(pointDatasetRepository, 'findOne')
        .mockImplementation(
          () => new Promise((resolve) => resolve(testPointDataset)),
        );

      jest.spyOn(httpService, 'post').mockImplementation(() => testObservable);

      const observable = await pointsService.getEntities(0);
      observable.subscribe((res) => {
        expect(res).toStrictEqual(testAxiosResponse.data);
      });
    });

    it('should return array of orion entities (use limit)', async () => {
      const testPointDataset: PointDataset = {
        id: 1,
        name: '公園',
        color: '#00E500',
        entityType: 'Park',
        coordinatesAttribute: 'location',
        registerTimeAttribute: 'time',
        enabled: true,
        category: {
          id: 1,
          name: '公共施設',
          color: '#00008B',
          displayOrder: 1,
          enabled: true,
          pointDatasets: [],
          surfaceDatasets: [],
          servicePath: {
            id: 1,
            name: '/path',
            categories: [],
            tenant: {
              id: 1,
              name: 'tenant',
              servicePaths: [],
            },
          },
        },
        pointDetails: [],
      };

      const testOrionData = [
        {
          id: 'ParkId001',
          type: 'Park',
          location: {
            type: 'geo:point',
            value: '35.9045568476736, 139.378167943858',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'ParkId002',
          type: 'Park',
          location: {
            type: 'geo:point',
            value: '35.8901393470751, 139.448973562127',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'ParkId003',
          type: 'Park',
          location: {
            type: 'geo:point',
            value: '36.0226681308094, 139.436079879839',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
      ];

      const testAxiosResponse: AxiosResponse<any> = {
        data: testOrionData,
        status: 200,
        statusText: '',
        headers: undefined,
        config: undefined,
      };

      const testObservable: Observable<AxiosResponse<any>> = new Observable(
        (subscriber) => {
          subscriber.next(testAxiosResponse);
        },
      );

      jest
        .spyOn(pointDatasetRepository, 'findOne')
        .mockImplementation(
          () => new Promise((resolve) => resolve(testPointDataset)),
        );

      jest.spyOn(httpService, 'post').mockImplementation(() => testObservable);

      const observable = await pointsService.getEntities(0, 1);
      observable.subscribe((res) => {
        expect(res).toStrictEqual(testAxiosResponse.data);
      });
    });
  });

  describe('getDetails', () => {
    it('should return array of details', async () => {
      const testPointDetails: any[] = [
        {
          id: 1,
          itemAttribute: 'address',
          displayOrder: 1,
          displayTitle: '住所',
          dataType: 0,
          enabled: true,
        },
      ];

      const testOrionData = {
        data: {
          entityId: 'ParkId001',
          address: 'testaddress',
        },
      };

      const result = [
        {
          id: 1,
          itemAttribute: 'address',
          displayOrder: 1,
          dataType: 0,
          displayTitle: '住所',
          enabled: true,
          value: 'testaddress',
        },
      ];

      const mockCreateQueryBuilder = {
        leftJoin: jest.fn(() => mockCreateQueryBuilder),
        where: jest.fn(() => mockCreateQueryBuilder),
        getMany: jest.fn(() => testPointDetails),
      };

      const testObservable: any = {
        toPromise: jest.fn(() => testOrionData),
      };

      jest
        .spyOn(pointDetailRepository, 'createQueryBuilder')
        .mockImplementation(() => mockCreateQueryBuilder);

      jest.spyOn(httpService, 'get').mockImplementation(() => testObservable);

      expect(await pointsService.getDetails(0, 'test')).toStrictEqual(result);
    });
  });
});
