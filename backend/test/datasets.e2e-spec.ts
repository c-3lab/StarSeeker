import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DatasetsModule } from './../src/datasets/datasets.module';
import { DatasetsService } from './../src/datasets/datasets.service';

describe('DatasetsController (e2e', () => {
  let app: INestApplication;
  const result = { message: 'test' };
  const datasetsService = { getEntities: () => result };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatasetsModule],
    })
      .overrideProvider(DatasetsService)
      .useValue(datasetsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/datasets/:datasetsId/entities (GET)`, () => {
    return request(app.getHttpServer())
      .get('/datasets/test/entities')
      .expect(200)
      .expect(datasetsService.getEntities());
  });

  afterAll(async () => {
    await app.close();
  });
});
