import { HttpService } from '@nestjs/axios';
import { SurfaceDataset } from 'db/entities/SurfaceDataset';
import { SurfaceDetail } from 'db/entities/SurfaceDetail';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { SurfacesController } from './surfaces.controller';
import { SurfacesService } from './surfaces.service';

describe('SurfacesController', () => {
  let httpService: HttpService;
  let surfaceDatasetRepository: Repository<SurfaceDataset>;
  let surfaceDetailRepository: Repository<SurfaceDetail>;
  let surfacesService: SurfacesService;
  let surfacesController: SurfacesController;

  beforeEach(async () => {
    httpService = new HttpService();
    surfaceDatasetRepository = new Repository<SurfaceDataset>();
    surfaceDetailRepository = new Repository<SurfaceDetail>();
    surfacesService = new SurfacesService(
      httpService,
      surfaceDatasetRepository,
      surfaceDetailRepository,
    );
    surfacesController = new SurfacesController(surfacesService);
  });

  it('should be defined', () => {
    expect(surfacesController).toBeDefined();
  });

  describe('getEntities', () => {
    it('should return', async () => {
      const result = new Observable((subscriber) => {
        subscriber.next([]);
      });

      jest
        .spyOn(surfacesService, 'getEntities')
        .mockImplementation(async () => result);
      expect(await surfacesController.getEntities(0, 0)).toBe(result);
    });
  });

  describe('getDetails', () => {
    it('should return', async () => {
      const result = new Observable((subscriber) => {
        subscriber.next([]);
      });

      jest
        .spyOn(surfacesService, 'getDetails')
        .mockImplementation(async () => result);
      expect(await surfacesController.getDetails(0, 'test')).toBe(result);
    });
  });
});
