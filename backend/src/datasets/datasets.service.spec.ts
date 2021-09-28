import { DatasetsService } from './datasets.service';
import { Category } from '../../db/entities/Category';
import { Repository } from 'typeorm';

describe('DatasetsService', () => {
  let categoryRepository: Repository<Category>;
  let datasetsService: DatasetsService;

  beforeEach(async () => {
    categoryRepository = new Repository<Category>();
    datasetsService = new DatasetsService(categoryRepository);
  });

  it('should be defined', () => {
    expect(datasetsService).toBeDefined();
  });

  describe('getDatasets', () => {
    it('should return array of datasets', async () => {
      const result = [
        {
          id: 2,
          name: '獣害情報',
          color: '#FFFC30',
          displayOrder: 2,
          enabled: true,
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
      expect(await datasetsService.getDatasets()).toBe(result);
    });
  });
});
