import { HttpModule, HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';

import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { PointDataset } from '../../db/entities/PointDataset';
import { PointDetail } from '../../db/entities/PointDetail';
import { Test, TestingModule } from '@nestjs/testing';
import { PointsModule } from './points.module';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('@nestjs/axios');
jest.mock('./points.module');

describe('PointsController', () => {
  let httpService: HttpService;
  let pointDatasetRepository: Repository<PointDataset>;
  let pointDetailRepository: Repository<PointDetail>;
  let pointsController: PointsController;
  let pointsService: PointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, PointsModule],
      providers: [
        HttpService,
        PointsService,
        {
          provide: getRepositoryToken(PointDataset),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PointDetail),
          useClass: Repository,
        },
      ],
      controllers: [PointsController],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    pointsService = module.get<PointsService>(PointsService);
    pointsController = module.get<PointsController>(PointsController);
    pointDatasetRepository = module.get(getRepositoryToken(PointDataset));
    pointDetailRepository = module.get(getRepositoryToken(PointDetail));
  });

  it('should be defined', () => {
    expect(httpService).toBeDefined();
    expect(pointsService).toBeDefined();
    expect(pointsController).toBeDefined();
    expect(pointDatasetRepository).toBeDefined();
    expect(pointDetailRepository).toBeDefined();
  });

  describe('getEntities', () => {
    it('should return', async () => {
      const result = new Observable((subscriber) => {
        subscriber.next([]);
      });

      jest
        .spyOn(pointsService, 'getEntities')
        .mockImplementation(async () => result);
      expect(await pointsController.getEntities(0, 0)).toBe(result);
    });
  });

  describe('getDetails', () => {
    it('should return', async () => {
      const result = [];

      jest
        .spyOn(pointsService, 'getDetails')
        .mockImplementation(async () => result);
      expect(await pointsController.getDetails(0, 'test')).toBe(result);
    });
  });
});
