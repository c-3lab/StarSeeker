import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../db/entities/Category';
import { DatasetsService } from './datasets.service';

describe('DatasetsService', () => {
  let service: DatasetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        DatasetsService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DatasetsService>(DatasetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
