import { DEFAULT_BOOLEAN, DEFAULT_STRING } from '@bjanderson/utils';
import { AccountProvider } from './account-provider.model';

describe('AccountProvider', () => {
  describe('constructor defaults', () => {
    const defaults = {
      id: null,
      isArchived: DEFAULT_BOOLEAN,
      name: DEFAULT_STRING,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new AccountProvider()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new AccountProvider()));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        id: 'test id',
        isArchived: !DEFAULT_BOOLEAN,
        name: 'test name',
      };

      expect(Object.values(test)).toEqual(Object.values(new AccountProvider(test)));
    });
  });
});
