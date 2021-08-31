import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { FeatureCollection } from './entities/points.entity';

describe('PointsController', () => {
  let httpService: HttpService;
  let pointsController: PointsController;
  let pointsService: PointsService;

  beforeEach(async () => {
    httpService = new HttpService();
    pointsService = new PointsService(httpService);
    pointsController = new PointsController(pointsService);
  });

  it('should be defined', () => {
    expect(pointsController).toBeDefined();
  });

  describe('points', () => {
    it('should return FeatureCollection object', async () => {
      const result: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              id: 'HospitalId099',
              name: 'Hospital099',
              address: 'HospitalAddress099',
            },
            geometry: {
              type: 'Point',
              coordinates: [139.39975142112, 36.0031312038852],
            },
          },
          {
            type: 'Feature',
            properties: {
              id: 'HospitalId100',
              name: 'Hospital100',
              address: 'HospitalAddress100',
            },
            geometry: {
              type: 'Point',
              coordinates: [139.356216596693, 35.9585502411543],
            },
          },
        ],
      };
      jest
        .spyOn(pointsService, 'getPoints')
        .mockImplementation(async () => result);

      expect(await pointsController.getPoints('test')).toBe(result);
    });
  });
});
