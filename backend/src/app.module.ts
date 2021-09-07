import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PointsModule } from './points/points.module';
import { DatasetsModule } from './datasets/datasets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
    }),
    PointsModule,
    DatasetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
