import {
  getDate,
  getNumber,
  getObject,
  getString,
  isNullOrEmpty,
  toKabob,
} from '@bjanderson/utils';
import { ICSVModel } from '../../interfaces';

export class AccountTransaction implements ICSVModel {
  accountId: string;
  amount: number;
  balance: number;
  date: string;
  description: string;
  escrow: number;

  get csvHeader(): string[] {
    return ['accountId', 'amount', 'balance', 'date', 'description', 'escrow'];
  }

  get id(): string {
    return [toKabob(this.accountId), toKabob(this.date), toKabob(this.description), this.amount]
      .filter((s) => !!s)
      .join('_');
  }

  constructor(o?: Partial<AccountTransaction>) {
    const obj: AccountTransaction = getObject(o);
    this.accountId = getString(obj.accountId);
    this.amount = getNumber(obj.amount);
    this.balance = getNumber(obj.balance);
    this.date = getDate(obj.date);
    this.description = getString(obj.description);
    this.escrow = getNumber(obj.escrow);
  }

  static parse(text: string): AccountTransaction {
    const obj = JSON.parse(text);
    return new AccountTransaction(obj);
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
