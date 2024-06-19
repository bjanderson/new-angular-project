import { DEFAULT_BOOLEAN, DEFAULT_NUMBER, DEFAULT_STRING } from '@bjanderson/utils';
import { AccountType } from '../../enums';
import { AccountTransaction } from '../account-transaction';
import { Account } from './account.model';

describe('Account', () => {
  describe('constructor defaults', () => {
    const defaults = {
      balance: DEFAULT_NUMBER,
      description: 'test description',
      id: null,
      isArchived: DEFAULT_BOOLEAN,
      name: DEFAULT_STRING,
      providerId: DEFAULT_STRING,
      providerName: DEFAULT_STRING,
      transactions: [],
      type: null,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new Account()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new Account()));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        balance: 1,
        description: 'test description',
        id: 'test id',
        isArchived: !DEFAULT_BOOLEAN,
        name: 'test name',
        providerId: 'test providerId',
        providerName: 'test providerName',
        transactions: [
          new AccountTransaction({ amount: 123.45, date: '2024-01-01T12:59:59.999Z', id: '1' }),
        ],
        type: AccountType.DEPOSIT,
      };

      expect(Object.values(test)).toEqual(Object.values(new Account(test)));
    });
  });

  describe('balance', () => {
    it('returns the sum of all transaction amounts', () => {
      const model = new Account({
        id: 'test id',
        name: 'test name',
        // transactions: [
        //   new AccountTransaction({ amount: 100, date: '2024-01-01T12:59:59.999Z', id: '1' }),
        //   new AccountTransaction({ amount: 10, date: '2024-01-01T12:59:59.999Z', id: '2' }),
        //   new AccountTransaction({ amount: -20, date: '2024-01-01T12:59:59.999Z', id: '3' }),
        // ],
      });
      expect(model.balance).toEqual(90);
    });
  });
});
