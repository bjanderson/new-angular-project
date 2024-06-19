import { getObject, getString } from '@bjanderson/utils';

export class Summary {
  public id: string;

  constructor(o?: Partial<Summary>) {
    const obj: Summary = getObject(o);
    this.id = getString(obj.id, null);
  }
}
