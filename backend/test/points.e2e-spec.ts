import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PointsService } from './../src/points/points.service';
import { PointsModule } from './../src/points/points.module';
import { PointDataset } from '../db/entities/PointDataset';
import { PointDetail } from '../db/entities/PointDetail';

describe('PointsController (e2e)', () => {
  let app: INestApplication;
  const result = { message: 'test' };
  const pointsService = {
    getEntities: () => result,
    getDetails: () => result,
  };

  const mockRepository = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PointsModule],
    })
      .overrideProvider(PointsService)
      .useValue(pointsService)
      .overrideProvider(getRepositoryToken(PointDataset))
      .useValue(mockRepository)
      .overrideProvider(getRepositoryToken(PointDetail))
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/points/:datasetId/entities (GET)`, () => {
    return request(app.getHttpServer())
      .get('/points/test/entities')
      .expect(200)
      .expect(pointsService.getEntities());
  });

  it(`/points/:datasetId/:entityId/details (GET)`, () => {
    return request(app.getHttpServer())
      .get('/points/test/test/details')
      .expect(200)
      .expect(pointsService.getDetails());
  });

  afterAll(async () => {
    await app.close();
  });
});
