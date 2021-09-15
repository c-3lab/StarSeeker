import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';

import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';
import { Category } from '../../db/entities/Category';

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
});
