import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EntitiesModule } from '../src/entities/entities.module';
import { EntitiesService } from '../src/entities/entities.service';

describe('EntitiesController (e2e)', () => {
  let app: INestApplication;
  const result = { message: 'test' };
  const entitiesService = { getDetails: () => result };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/entities/:datasetId/:entityId/details (GET)', () => {
    return request(app.getHttpServer())
      .get('/entities/test/test/details')
      .expect(200)
      .expect(entitiesService.getDetails());
  });

  afterAll(async () => {
    await app.close();
  });
});
