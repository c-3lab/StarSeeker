import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';

describe('EntitiesController', () => {
  let httpService: HttpService;
  let entitiesController: EntitiesController;
  let entitiesService: EntitiesService;

  beforeEach(async () => {
    httpService = new HttpService();
    entitiesService = new EntitiesService(httpService);
    entitiesController = new EntitiesController(entitiesService);
  });

  it('should be defined', () => {
    expect(entitiesController).toBeDefined();
  });

  describe('getDetails', () => {
    it('should return orion entities', () => {
      const result = [
        {
          id: 'HospitalId100',
          type: 'Hospital',
          address: {
            type: 'Text',
            value: 'HospitalAddress100',
            metadata: {},
          },
          locationName: {
            type: 'Text',
            value: 'Hospital100',
            metadata: {},
          },
        },
      ];
      jest
        .spyOn(entitiesService, 'getDetails')
        .mockImplementation(() => of(result));

      entitiesService.getDetails('test', 'test').subscribe((res) => {
        expect(res).toBe(result);
      });
    });
  });
});
