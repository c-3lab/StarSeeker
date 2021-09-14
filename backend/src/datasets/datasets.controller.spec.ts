import { HttpService } from '@nestjs/axios';
import { Category } from '../../db/entities/Category';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';

describe('DatasetsController', () => {
  let httpService: HttpService;
  let categoryRepository: Repository<Category>;
  let datasetsController: DatasetsController;
  let datasetsService: DatasetsService;

  beforeEach(async () => {
    httpService = new HttpService();
    categoryRepository = new Repository<Category>();
    datasetsService = new DatasetsService(httpService, categoryRepository);
    datasetsController = new DatasetsController(datasetsService);
  });

  it('should be defined', () => {
    expect(datasetsController).toBeDefined();
  });

  describe('getDatasets', () => {
    it('should return array of datasets', async () => {
      const result: Category[] = [
        {
          categoryId: 2,
          categoryName: '獣害情報',
          categoryColor: '#FFFC30',
          displayOrder: 2,
          enabled: true,
          pointDatasets: [],
          surfaceDatasets: [],
        },
        {
          categoryId: 1,
          categoryName: '公共施設',
          categoryColor: '#00008B',
          displayOrder: 1,
          enabled: true,
          pointDatasets: [],
          surfaceDatasets: [],
        },
      ];
      jest
        .spyOn(datasetsService, 'getDatasets')
        .mockImplementation(async () => result);
      expect(await datasetsController.getDataSets()).toBe(result);
    });
  });

  describe('getEntities', () => {
    it('should return array of orion entities ', () => {
      const result = [
        {
          id: 'HospitalId099',
          type: 'Hospital',
          location: {
            type: 'geo:point',
            value: '36.0031312038852, 139.39975142112',
            metadata: {},
          },
          locationName: {
            type: 'Text',
            value: 'Hospital099',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'HospitalId100',
          type: 'Hospital',
          location: {
            type: 'geo:point',
            value: '35.9585502411543, 139.356216596693',
            metadata: {},
          },
          locationName: {
            type: 'Text',
            value: 'Hospital100',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
      ];
      jest
        .spyOn(datasetsService, 'getEntities')
        .mockImplementation(() => of(result));
      datasetsService.getEntities('test').subscribe((res) => {
        expect(res).toBe(result);
      });
    });
  });
});
