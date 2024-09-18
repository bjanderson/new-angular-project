import { IDatabaseModel } from '@bjanderson/moneytool-shared';
import { getArrayOfModels } from '@bjanderson/utils';
import { DatabaseService } from 'src/database/database.service';

export abstract class AbstractCRUDService<T extends IDatabaseModel> {
  constructor(
    protected databaseService: DatabaseService,
    protected Model: new (o?: Partial<T>) => T,
  ) {
    this.databaseService.createTable(this.Model);
  }

  create(values: T[]): Promise<T[]> {
    const valueToInsert = getArrayOfModels(
      this.Model,
      values.filter((v) => v != null),
    );
    const promise = new Promise<T[]>((resolve, reject) => {
      try {
        const createdValues = [];
        valueToInsert.forEach((value) => {
          this.databaseService.create<T>(value).then((v) => {
            createdValues.push(v);
            if (createdValues.length === values.length) {
              resolve(createdValues);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  findAll(ids?: string[]): Promise<T[]> {
    return this.databaseService.findAll<T>(this.Model, ids);
  }

  findOne(id: string): Promise<T> {
    return this.databaseService.findOne<T>(this.Model, id);
  }

  update(id: string, value: T): Promise<T> {
    return this.databaseService.update<T>(id, new this.Model(value));
  }

  remove(id: string): Promise<T> {
    return this.databaseService.remove<T>(this.Model, id);
  }
}
