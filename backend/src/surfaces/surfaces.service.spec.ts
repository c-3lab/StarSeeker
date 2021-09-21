import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SurfacesService } from './surfaces.service';
import { SurfaceDataset } from '../../db/entities/SurfaceDataset';
import { SurfaceDetail } from '../../db/entities/SurfaceDetail';

describe('SurfacesService', () => {
  let service: SurfacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SurfacesService,
        {
          provide: getRepositoryToken(SurfaceDataset),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SurfaceDetail),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SurfacesService>(SurfacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
