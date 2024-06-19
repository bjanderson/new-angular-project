import { DEFAULT_STRING } from '@bjanderson/utils';
import { Summary } from './summary.model';

describe('Summary', () => {
  describe('constructor defaults', () => {
    const defaults = {
      id: null,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new Summary()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new Summary()));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        id: 'test id',
      };

      expect(Object.values(test)).toEqual(Object.values(new Summary(test)));
    });
  });
});
