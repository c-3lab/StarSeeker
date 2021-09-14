import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PointsModule } from './points/points.module';
import { DatasetsModule } from './datasets/datasets.module';
import { EntitiesModule } from './entities/entities.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      entities: [
        process.env.NODE_ENV === 'test'
          ? 'db/entities/*.ts'
          : 'dist/db/entities/*.js',
      ],
      synchronize:
        process.env.TYPEORM_SYNCHRONIZE.toLowerCase() === 'true' ? true : false,
      autoLoadEntities: true,
    }),
    PointsModule,
    DatasetsModule,
    EntitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
