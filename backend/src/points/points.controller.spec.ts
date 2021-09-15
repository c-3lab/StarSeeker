import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';

import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { PointDataset } from '../../db/entities/PointDataset';
import { PointDetail } from '../../db/entities/PointDetail';

describe('PointsController', () => {
  let httpService: HttpService;
  let pointDatasetRepository: Repository<PointDataset>;
  let pointDetailRepository: Repository<PointDetail>;
  let pointsController: PointsController;
  let pointsService: PointsService;

  beforeEach(async () => {
    httpService = new HttpService();
    pointDatasetRepository = new Repository<PointDataset>();
    pointDetailRepository = new Repository<PointDetail>();
    pointsService = new PointsService(
      httpService,
      pointDatasetRepository,
      pointDetailRepository,
    );
    pointsController = new PointsController(pointsService);
  });

  it('should be defined', () => {
    expect(pointsController).toBeDefined();
  });

  describe('getEntities', () => {
    it('should return array of orion entities', async () => {
      const result = new Observable((subscriber) => {
        subscriber.next([
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
        ]);
      });
      jest
        .spyOn(pointsService, 'getEntities')
        .mockImplementation(async () => result);
      expect(await pointsController.getEntities(0, 0)).toBe(result);
    });
  });
});
