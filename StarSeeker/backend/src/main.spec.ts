import { NestFactory } from '@nestjs/core';
import { bootstrap } from './main';

jest.mock('./app.module');

describe('Main', () => {
  describe('bootstrap', () => {
    let app;
    afterEach(() => {
      if (app) app.close();
    });

    it('should create new nest aplication', async () => {
      const spy = jest.spyOn(NestFactory, 'create');

      app = await bootstrap();

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
