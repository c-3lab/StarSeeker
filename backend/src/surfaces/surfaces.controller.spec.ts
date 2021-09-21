import { HttpService } from '@nestjs/axios';
import { SurfaceDataset } from 'db/entities/SurfaceDataset';
import { SurfaceDetail } from 'db/entities/SurfaceDetail';
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
});
