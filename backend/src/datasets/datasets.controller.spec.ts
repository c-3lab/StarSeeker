import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';

describe('DatasetsController', () => {
  let httpService: HttpService;
  let datasetsController: DatasetsController;
  let datasetsService: DatasetsService;

  beforeEach(async () => {
    httpService = new HttpService();
    datasetsService = new DatasetsService(httpService);
    datasetsController = new DatasetsController(datasetsService);
  });

  it('should be defined', () => {
    expect(datasetsController).toBeDefined();
  });
  describe('getEntities', () => {
    it('should return array of orion entities ', () => {
      const result = [
        {
          id: 'HospitalId099',
          type: 'Hospital',
          location: {
            type: 'geo:point',
            value: '36.0031312038852, 139.39975142112',
            metadata: {},
          },
          locationName: {
            type: 'Text',
            value: 'Hospital099',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
        {
          id: 'HospitalId100',
          type: 'Hospital',
          location: {
            type: 'geo:point',
            value: '35.9585502411543, 139.356216596693',
            metadata: {},
          },
          locationName: {
            type: 'Text',
            value: 'Hospital100',
            metadata: {},
          },
          time: {
            type: 'DateTime',
            value: '2021-08-23T15:00:00.000Z',
            metadata: {},
          },
        },
      ];
      jest
        .spyOn(datasetsService, 'getEntities')
        .mockImplementation(() => of(result));
      datasetsService.getEntities('test').subscribe((res) => {
        expect(res).toBe(result);
      });
    });
  });
});
