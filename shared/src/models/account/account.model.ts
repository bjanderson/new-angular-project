import {
  getArrayOfModels,
  getBoolean,
  getNumber,
  getObject,
  getString,
  isNullOrEmpty,
  toKabob,
} from '@bjanderson/utils';
import { AccountType, BalanceSheetType } from '../../enums';
import { ICSVModel } from '../../interfaces';
import { AccountTransaction } from '../account-transaction';

export class Account implements ICSVModel {
  accountProviderName: string;
  accountType: AccountType;
  balance: number;
  balanceSheetType: BalanceSheetType;
  isArchived: boolean;
  name: string;
  purchasePrice: number;
  downPayment: number;
  paymentsPerYear: number;
  numberOfYears: number;
  interestRate: number;
  transactions: AccountTransaction[];

  get csvHeader(): string[] {
    let header = ['accountProviderName', 'name', 'accountType', 'balanceSheetType', 'isArchived'];
    if (this.balanceSheetType === BalanceSheetType.LIABILITY) {
      header = [
        ...header,
        'purchasePrice',
        'downPayment',
        'paymentsPerYear',
        'numberOfYears',
        'interestRate',
      ];
    }
    return header;
  }

  get id(): string {
    return [toKabob(this.accountProviderName), toKabob(this.name)].filter((s) => !!s).join('_');
  }

  constructor(o?: Partial<Account>) {
    const obj: Account = getObject(o);
    this.accountProviderName = getString(obj.accountProviderName);
    this.accountType = AccountType[obj.accountType];
    this.balance = getNumber(obj.balance);
    this.balanceSheetType = BalanceSheetType[obj.balanceSheetType];
    this.isArchived = getBoolean(obj.isArchived);
    this.name = getString(obj.name);
    this.purchasePrice = getNumber(obj.purchasePrice);
    this.downPayment = getNumber(obj.downPayment);
    this.paymentsPerYear = getNumber(obj.paymentsPerYear);
    this.numberOfYears = getNumber(obj.numberOfYears);
    this.interestRate = getNumber(obj.interestRate);
    this.transactions = getArrayOfModels(AccountTransaction, obj.transactions);
  }

  static parse(text: string): Account {
    const obj = JSON.parse(text);
    return new Account(obj);
  }

  stringify(): string {
    const obj = { ...this };
    Object.keys(this).forEach((key) => {
      if (isNullOrEmpty(obj[key]) || !obj[key]) {
        delete obj[key];
      }
    });
    return JSON.stringify(obj, null, 2);
  }
}
