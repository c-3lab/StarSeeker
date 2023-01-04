import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';

import { SurfacesService } from './surfaces.service';
import { SurfaceDataset } from '../../db/entities/SurfaceDataset';
import { SurfaceDetail } from '../../db/entities/SurfaceDetail';
import { Observable } from 'rxjs';

jest.mock('@nestjs/axios');

describe('SurfacesService', () => {
  let httpService: HttpService;
  let surfacesService: SurfacesService;
  let surfaceDatasetRepository: Repository<SurfaceDataset>;
  let surfaceDetailRepository: Repository<SurfaceDetail>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SurfacesService,
        HttpService,
        {
          provide: getRepositoryToken(SurfaceDataset),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SurfaceDetail),
          useClass: Repository,
        },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    surfacesService = module.get<SurfacesService>(SurfacesService);
    surfaceDatasetRepository = module.get(getRepositoryToken(SurfaceDataset));
    surfaceDetailRepository = module.get(getRepositoryToken(SurfaceDetail));
  });

  it('should be defined', () => {
    expect(surfacesService).toBeDefined();
  });

  describe('getEntities', () => {
    it('shold return array of orion entities', async () => {
      const testSurfaceDataset: SurfaceDataset = {
        id: 1,
        name: '埼玉県',
        borderColor: '#000000',
        fillColor: '#006400',
        entityType: 'City',
        coordinatesAttribute: 'location',
        registerTimeAttribute: 'time',
        enabled: true,
        category: {
          id: 3,
          name: '市町村情報',
          color: '#FFFC30',
          displayOrder: 3,
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
        surfaceDetails: [],
      };

      const testOrionData = [
        {
          id: 'CityId001',
          type: 'City',
          location: {
            type: 'geo:polygon',
            value: [
              '36.104795053748774,139.3909375877995',
              '36.104724224943084,139.39102286601258',
              '36.104752558983478,139.39115063629288',
              '36.104858946083539,139.39118619998317',
              '36.104929774889229,139.39122175108298',
            ],
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-26T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'CityId002',
          type: 'City',
          location: {
            type: 'geo:polygon',
            value: [
              '35.993971170832936,139.43449141364783',
              '35.993750613000429,139.43454169924007',
              '35.993448108043822,139.43454807992998',
              '35.992938946075526,139.43450557707081',
              '35.992918946052555,139.43450391692227',
            ],
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-26T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'CityId003',
          type: 'City',
          location: {
            type: 'geo:polygon',
            value: [
              '35.992516440981035,139.43458031073283',
              '35.992087837583711,139.43473807969872',
              '35.991666667083052,139.43490236065543',
              '35.991666170657311,139.43490255490906',
              '35.991488945758306,139.43497169928457',
            ],
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-26T15:00:00.000Z',
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
        .spyOn(surfaceDatasetRepository, 'findOne')
        .mockImplementation(
          () => new Promise((resolve) => resolve(testSurfaceDataset)),
        );

      jest.spyOn(httpService, 'post').mockImplementation(() => testObservable);

      const observable = await surfacesService.getEntities(0);
      observable.subscribe((res) => {
        expect(res).toStrictEqual(testAxiosResponse.data);
      });
    });
  });

  describe('getEntities', () => {
    it('shold return array of orion entities (use limit)', async () => {
      const testSurfaceDataset: SurfaceDataset = {
        id: 1,
        name: '埼玉県',
        borderColor: '#000000',
        fillColor: '#006400',
        entityType: 'City',
        coordinatesAttribute: 'location',
        registerTimeAttribute: 'time',
        enabled: true,
        category: {
          id: 3,
          name: '市町村情報',
          color: '#FFFC30',
          displayOrder: 3,
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
        surfaceDetails: [],
      };

      const testOrionData = [
        {
          id: 'CityId001',
          type: 'City',
          location: {
            type: 'geo:polygon',
            value: [
              '36.104795053748774,139.3909375877995',
              '36.104724224943084,139.39102286601258',
              '36.104752558983478,139.39115063629288',
              '36.104858946083539,139.39118619998317',
              '36.104929774889229,139.39122175108298',
            ],
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-26T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'CityId002',
          type: 'City',
          location: {
            type: 'geo:polygon',
            value: [
              '35.993971170832936,139.43449141364783',
              '35.993750613000429,139.43454169924007',
              '35.993448108043822,139.43454807992998',
              '35.992938946075526,139.43450557707081',
              '35.992918946052555,139.43450391692227',
            ],
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-26T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'CityId003',
          type: 'City',
          location: {
            type: 'geo:polygon',
            value: [
              '35.992516440981035,139.43458031073283',
              '35.992087837583711,139.43473807969872',
              '35.991666667083052,139.43490236065543',
              '35.991666170657311,139.43490255490906',
              '35.991488945758306,139.43497169928457',
            ],
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-26T15:00:00.000Z',
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
        .spyOn(surfaceDatasetRepository, 'findOne')
        .mockImplementation(
          () => new Promise((resolve) => resolve(testSurfaceDataset)),
        );

      jest.spyOn(httpService, 'post').mockImplementation(() => testObservable);

      const observable = await surfacesService.getEntities(0, 1);
      observable.subscribe((res) => {
        expect(res).toStrictEqual(testAxiosResponse.data);
      });
    });
  });

  describe('getDetails', () => {
    it('should return array of details', async () => {
      const testSurfaceDetails: any[] = [
        {
          id: 1,
          itemAttribute: 'cityName',
          displayOrder: 1,
          displayTitle: '都市名',
          enabled: true,
        },
      ];

      const testOrionData = {
        data: {
          id: 'CityId002',
          cityName: '坂戸市',
        },
      };

      const result = [
        {
          id: 1,
          itemAttribute: 'cityName',
          displayOrder: 1,
          displayTitle: '都市名',
          enabled: true,
          value: '坂戸市',
        },
      ];

      const createQueryBuilder = {
        leftJoin: jest.fn(() => createQueryBuilder),
        where: jest.fn(() => createQueryBuilder),
        getMany: jest.fn(() => testSurfaceDetails),
      };

      const testObservable: any = {
        toPromise: jest.fn(() => testOrionData),
      };

      jest
        .spyOn(surfaceDetailRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      jest.spyOn(httpService, 'get').mockImplementation(() => testObservable);

      expect(await surfacesService.getDetails(0, 'test')).toStrictEqual(result);
    });
  });
});
