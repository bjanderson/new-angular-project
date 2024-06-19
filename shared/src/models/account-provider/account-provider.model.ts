import { getBoolean, getObject, getString, isNullOrEmpty, toKabob } from '@bjanderson/utils';
import { ICSVModel } from '../../interfaces';

export class AccountProvider implements ICSVModel {
  name: string;
  address: string;
  phoneNumber: string;
  website: string;
  description: string;
  isArchived: boolean;

  get csvHeader(): string[] {
    return ['name', 'address', 'phoneNumber', 'website', 'description', 'isArchived'];
  }

  get id(): string {
    return toKabob(this.name);
  }

  constructor(o?: Partial<AccountProvider>) {
    const obj: AccountProvider = getObject(o);
    this.name = getString(obj.name);
    this.address = getString(obj.address);
    this.phoneNumber = getString(obj.phoneNumber);
    this.website = getString(obj.website);
    this.description = getString(obj.description);
    this.isArchived = getBoolean(obj.isArchived);
  }

  static parse(text: string): AccountProvider {
    const obj = JSON.parse(text);
    return new AccountProvider(obj);
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
