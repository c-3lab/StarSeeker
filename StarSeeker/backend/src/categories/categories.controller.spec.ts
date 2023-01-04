import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesModule } from './categories.module';
import { Category } from '../../db/entities/Category';
import { ServicePath } from '../../db/entities/ServicePath';
import { Tenant } from '../../db/entities/Tenant';

jest.mock('./categories.module');

describe('CategoriesController', () => {
  let categoryRepository: Repository<Category>;
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServicePath),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useClass: Repository,
        },
      ],
      controllers: [CategoriesController],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesController =
      module.get<CategoriesController>(CategoriesController);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
    expect(categoriesController).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return', async () => {
      const result = [];

      jest
        .spyOn(categoriesService, 'getCategories')
        .mockImplementation(async () => result);
      expect(await categoriesController.getCategories('tenant', '/path')).toBe(
        result,
      );
    });
  });
});
