import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get() {
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
