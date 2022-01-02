import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('StarSeeker')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get() {
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
