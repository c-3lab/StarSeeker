import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PointsService } from './points.service';
import { PointDataset } from '../../db/entities/PointDataset';
import { PointDetail } from '../../db/entities/PointDetail';

describe('PointsService', () => {
  let service: PointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
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
    }).compile();

    service = module.get<PointsService>(PointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
