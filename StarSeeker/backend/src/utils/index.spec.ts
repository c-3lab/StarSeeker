import { isTesting, toBoolean, getEntityFilepath } from './index';

describe('Utils', () => {
  describe('isTesting', () => {
    it('should return true when testing', () => {
      expect(isTesting()).toBeTruthy();
    });
  });

  describe('getEntityFilepath', () => {
    it('should return entity filepath', () => {
      expect(getEntityFilepath(true)).toBe('db/entities/*.ts');
      expect(getEntityFilepath(false)).toBe('dist/db/entities/*.js');
    });
  });

  describe('toBoolean', () => {
    it('should return true', () => {
      expect(toBoolean('true')).toBeTruthy();
    });

    it('should return false', () => {
      expect(toBoolean('false')).toBeFalsy();
      expect(toBoolean('')).toBeFalsy();
    });
  });
});
