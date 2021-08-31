import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FeatureCollection } from './entities/points.entity';

@Injectable()
export class PointsService {
  constructor(private httpService: HttpService) {}

  async getPoints(type: string, limit?: number): Promise<FeatureCollection> {
    const url = `${process.env.ORION_URI}/v2/entities?type=${type}${
      limit ? '&limit=' + limit : ''
    }`;
    const res = await this.httpService.get(url).toPromise();
    const data = res.data;

    const features = [];
    for (const e of data) {
      const properties = {
        id: e.id,
        name: e.locationName.value,
        address: e.address.value,
      };

      const coordinates = e.location.value
        .split(', ')
        .map((s: string) => parseFloat(s));
      [coordinates[0], coordinates[1]] = [coordinates[1], coordinates[0]];

      const geometry = {
        type: 'Point',
        coordinates: coordinates,
      };

      const feature = {
        type: 'Feature',
        properties: properties,
        geometry: geometry,
      };

      features.push(feature);
    }
    const featureCollection = new FeatureCollection();
    featureCollection.features = features;

    return featureCollection;
  }
}
