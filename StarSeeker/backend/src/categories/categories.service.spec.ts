import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoriesService } from './categories.service';
import { Category } from '../../db/entities/Category';
import { ServicePath } from '../../db/entities/ServicePath';
import { Tenant } from '../../db/entities/Tenant';

describe('CategoriesService', () => {
  let categoryRepository: Repository<Category>;
  let categoriesService: CategoriesService;
  let tenantRepository: Repository<Tenant>;
  let servicePathRepository: Repository<ServicePath>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Tenant),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServicePath),
          useClass: Repository,
        },
      ],
    }).compile();

    tenantRepository = module.get(getRepositoryToken(Tenant));
    servicePathRepository = module.get(getRepositoryToken(ServicePath));
    categoryRepository = new Repository<Category>();
    categoriesService = new CategoriesService(
      categoryRepository,
      servicePathRepository,
      tenantRepository,
    );
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return array of categories', async () => {
      const result = [
        {
          id: 2,
          name: '獣害情報',
          color: '#FFFC30',
          displayOrder: 2,
          enabled: true,
          servicePath: {
            id: 1,
            name: '/path',
            tenant: {
              id: 1,
              name: 'tenant',
            },
          },
          pointDatasets: [
            {
              id: 3,
              name: '獣害出没情報',
              color: '#FFFC30',
              entityType: 'NuisanceWildlife',
              coordinatesAttribute: 'location',
              registerTimeAttribute: 'time',
              enabled: true,
            },
          ],
          surfaceDatasets: [],
        },
        {
          id: 1,
          name: '公共施設',
          color: '#00008B',
          displayOrder: 1,
          enabled: true,
          servicePath: {
            id: 1,
            name: '/path',
            tenant: {
              id: 1,
              name: 'tenant',
            },
          },
          pointDatasets: [
            {
              id: 2,
              name: '病院',
              color: '#FF0000',
              entityType: 'Hospital',
              coordinatesAttribute: 'location',
              registerTimeAttribute: 'time',
              enabled: true,
            },
            {
              id: 1,
              name: '公園',
              color: '#00E500',
              entityType: 'Park',
              coordinatesAttribute: 'location',
              registerTimeAttribute: 'time',
              enabled: true,
            },
          ],
          surfaceDatasets: [],
        },
      ];

      const mockCreateQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => result),
      };

      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockImplementation(() => mockCreateQueryBuilder);
      expect(await categoriesService.getCategories('tenant', '/path')).toBe(
        result,
      );
    });
  });
});
