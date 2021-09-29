import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CategoriesModule } from './../src/categories/categories.module';
import { CategoriesService } from './../src/categories/categories.service';
import { Category } from '../db/entities/Category';

describe('CategoriesController (e2e', () => {
  let app: INestApplication;

  const result = { message: 'test' };
  const categoriesService = {
    getCategories: () => result,
  };

  const mockRepository = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
    })
      .overrideProvider(CategoriesService)
      .useValue(categoriesService)
      .overrideProvider(getRepositoryToken(Category))
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/categories (GET)`, () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect(categoriesService.getCategories());
  });
});
