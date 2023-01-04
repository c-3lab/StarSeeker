import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { PointsModule } from './points/points.module';
import { CategoriesModule } from './categories/categories.module';
import { SurfacesModule } from './surfaces/surfaces.module';
import * as utils from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [utils.getEntityFilepath(utils.isTesting())],
      synchronize: utils.toBoolean(process.env.TYPEORM_SYNCHRONIZE),
      autoLoadEntities: true,
      logging: true,
    }),
    TenantsModule,
    PointsModule,
    CategoriesModule,
    SurfacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
