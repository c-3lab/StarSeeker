import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PointsService } from './../src/points/points.service';
import { PointsModule } from './../src/points/points.module';

describe('PointsController (e2e)', () => {
  let app: INestApplication;
  const result = { message: 'test' };
  const pointsService = { getPoints: () => result };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PointsModule],
    })
      .overrideProvider(PointsService)
      .useValue(pointsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/points/:type (GET)`, () => {
    return request(app.getHttpServer())
      .get('/points/test')
      .expect(200)
      .expect(pointsService.getPoints());
  });

  afterAll(async () => {
    await app.close();
  });
});
