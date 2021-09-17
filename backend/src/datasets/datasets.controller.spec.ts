import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';
import { DatasetsModule } from './datasets.module';
import { Category } from '../../db/entities/Category';

jest.mock('./datasets.module');

describe('DatasetsController', () => {
  let categoryRepository: Repository<Category>;
  let datasetsController: DatasetsController;
  let datasetsService: DatasetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatasetsModule],
      providers: [
        DatasetsService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
      controllers: [DatasetsController],
    }).compile();

    datasetsService = module.get<DatasetsService>(DatasetsService);
    datasetsController = module.get<DatasetsController>(DatasetsController);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(datasetsController).toBeDefined();
  });

  describe('getDatasets', () => {
    it('should return', async () => {
      const result = [];

      jest
        .spyOn(datasetsService, 'getDatasets')
        .mockImplementation(async () => result);
      expect(await datasetsController.getDataSets()).toBe(result);
    });
  });
});
