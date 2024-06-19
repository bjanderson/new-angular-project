import { DEFAULT_NUMBER, DEFAULT_STRING } from '@bjanderson/utils';
import { AccountTransaction } from './account-transaction.model';

describe('AccountTransaction', () => {
  describe('constructor defaults', () => {
    const defaults = {
      accountId: DEFAULT_STRING,
      amount: DEFAULT_NUMBER,
      balance: DEFAULT_NUMBER,
      date: DEFAULT_STRING,
      description: DEFAULT_STRING,
      id: null,
      sharePrice: DEFAULT_NUMBER,
      shares: DEFAULT_NUMBER,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new AccountTransaction()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new AccountTransaction()));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        accountId: 'test accountId',
        amount: 1234567.89,
        balance: 123.45,
        date: '2024-01-01T12:59:59.999Z',
        description: 'test description',
        id: 'test id',
        sharePrice: 12.34,
        shares: 56,
      };

      expect(Object.values(test)).toEqual(Object.values(new AccountTransaction(test)));
    });
  });
});
