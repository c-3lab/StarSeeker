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
          categoryId: 2,
          categoryName: '獣害情報',
          categoryColor: '#FFFC30',
          displayOrder: 2,
          enabled: true,
          pointDatasets: [
            {
              pointDatasetId: 3,
              pointDatasetName: '獣害出没情報',
              pointColorCode: '#FFFC30',
              entityType: 'NuisanceWildlife',
              coordinatesAttrName: 'location',
              registerTimeAttrName: 'time',
              enabled: true,
            },
          ],
          surfaceDatasets: [],
        },
        {
          categoryId: 1,
          categoryName: '公共施設',
          categoryColor: '#00008B',
          displayOrder: 1,
          enabled: true,
          pointDatasets: [
            {
              pointDatasetId: 2,
              pointDatasetName: '病院',
              pointColorCode: '#FF0000',
              entityType: 'Hospital',
              coordinatesAttrName: 'location',
              registerTimeAttrName: 'time',
              enabled: true,
            },
            {
              pointDatasetId: 1,
              pointDatasetName: '公園',
              pointColorCode: '#00E500',
              entityType: 'Park',
              coordinatesAttrName: 'location',
              registerTimeAttrName: 'time',
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
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(() => result),
      };

      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockImplementation(() => mockCreateQueryBuilder);
      expect(await datasetsService.getDatasets()).toBe(result);
    });
  });
});
