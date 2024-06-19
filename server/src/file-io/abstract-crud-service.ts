import { ICSVModel } from '@bjanderson/my-project-shared';
import { getArrayOfModels, newIfDefined } from '@bjanderson/utils';
import { Injectable } from '@nestjs/common';
import { FileIOService } from 'src/file-io';

@Injectable()
export class AbstractCRUDService<T extends ICSVModel> {
  private data: T[];

  constructor(
    protected fileIOService: FileIOService,
    protected Model: new (o?: Partial<T>) => T,
    protected fileName: string,
  ) {
    this.data = [];
    this.loadData();
  }

  setFileName(fileName: string): void {
    this.fileName = `${fileName.replace('.json', '')}.json`.replace(/\'/g, '');
  }

  private loadData(): void {
    const json = this.fileIOService.readJSONFile(this.fileName);
    this.data = getArrayOfModels(this.Model, json);
  }

  create(values: T[]): Promise<T[]> {
    const promise = new Promise<T[]>((resolve, reject) => {
      const valuesToInsert = getArrayOfModels(
        this.Model,
        values.filter((v) => v != null),
      );
      try {
        this.data = [...this.data, ...valuesToInsert];
        this.fileIOService.writeCSVFile(this.fileName, this.data);
        resolve(valuesToInsert);
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  findAll(ids?: string[]): Promise<T[]> {
    const promise = new Promise<T[]>((resolve, reject) => {
      try {
        resolve(this.data);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  findOne(id: string): Promise<T> {
    const promise = new Promise<T>((resolve, reject) => {
      try {
        const item = newIfDefined(
          this.Model,
          this.data.find((d) => d.id === id),
        );
        resolve(item);
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  update(id: string, value: T): Promise<T> {
    const promise = new Promise<T>((resolve, reject) => {
      try {
        const i = this.data.findIndex((d) => d.id === id);
        this.data[i] = value;
        this.fileIOService.writeCSVFile(this.fileName, this.data);
        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  remove(id: string): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      try {
        this.data = this.data.filter((d) => d.id !== id);
        this.fileIOService.writeCSVFile(this.fileName, this.data);
        resolve(id);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
}
