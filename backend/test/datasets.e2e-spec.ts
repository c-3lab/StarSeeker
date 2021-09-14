import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DatasetsModule } from './../src/datasets/datasets.module';
import { DatasetsService } from './../src/datasets/datasets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../db/entities/Category';

describe('DatasetsController (e2e', () => {
  let app: INestApplication;

  const result = { message: 'test' };
  const datasetsService = {
    getDatasets: () => result,
    getEntities: () => result,
  };

  const mockRepository = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatasetsModule],
    })
      .overrideProvider(DatasetsService)
      .useValue(datasetsService)
      .overrideProvider(getRepositoryToken(Category))
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/datasets (GET)`, () => {
    return request(app.getHttpServer())
      .get('/datasets')
      .expect(200)
      .expect(datasetsService.getDatasets());
  });

  it(`/datasets/:datasetsId/entities (GET)`, () => {
    return request(app.getHttpServer())
      .get('/datasets/test/entities')
      .expect(200)
      .expect(datasetsService.getEntities());
  });
});
