import * as main from './main';

jest.mock('./main');

describe('Server', () => {
  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should bootstrap', async () => {
    require('./server');

    expect(main.bootstrap).toHaveBeenCalledTimes(1);
  });
});
