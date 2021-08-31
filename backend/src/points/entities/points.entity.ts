import { ApiProperty } from '@nestjs/swagger';
import { Feature } from '../interfaces/points.interface';

export class FeatureCollection {
  type: 'FeatureCollection';

  @ApiProperty({
    example: [
      {
        type: 'Feature',
        properties: {
          id: 'HospitalId099',
          name: 'Hospital099',
          address: 'HospitalAddress099',
        },
        geometry: {
          type: 'Point',
          coordinates: [139.39975142112, 36.0031312038852],
        },
      },
      {
        type: 'Feature',
        properties: {
          id: 'HospitalId100',
          name: 'Hospital100',
          address: 'HospitalAddress100',
        },
        geometry: {
          type: 'Point',
          coordinates: [139.356216596693, 35.9585502411543],
        },
      },
    ],
    description: 'Feature list of GeoJSON format',
  })
  features: Feature[];
}
