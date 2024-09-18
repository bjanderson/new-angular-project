import { IDatabaseModel } from '@bjanderson/moneytool-shared';
import { getArrayOfModels, isNullOrEmpty } from '@bjanderson/utils';
import { Injectable, Logger } from '@nestjs/common';
import { Database } from 'sqlite3';
import { v4 as guid } from 'uuid';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger('DatabaseService');

  connect(): Database {
    // this.logger.log('connect to database');
    const db = new Database('../moneytool.sqlite');
    // db.on('trace', (sql) => {
    //   this.logger.log(`Trace: ${sql}`);
    // });
    // db.on('profile', (sql, time) => {
    //   this.logger.log(`Profile: ${time} - ${sql}`);
    // });
    return db;
  }

  close(db: Database): void {
    // this.logger.log('close database');
    db.close();
  }

  createTable<T extends IDatabaseModel>(Model: new (o?: Partial<T>) => T): void {
    const model = new Model();
    const sql = `CREATE TABLE IF NOT EXISTS ${model.tableName} (${model.tableColumnDefinitions.join(', ')});`;
    this.dbRun(sql);
  }

  create<T extends IDatabaseModel>(value: T): Promise<T> {
    if (isNullOrEmpty(value?.id)) {
      value.id = guid();
    }
    const columnNames = this.getColumnNames(value.tableColumnDefinitions);
    const values = this.getValues(columnNames, value);
    const valueMarkers = values.map(() => '?').join(',');
    const sql = `INSERT INTO ${value.tableName} (${columnNames}) VALUES (${valueMarkers})`;
    this.logger.log(sql);
    this.logger.log(values);
    return this.dbRun(sql, values).then(() => value);
  }

  findAll<T extends IDatabaseModel>(
    Model: new (o?: Partial<T>) => T,
    ids?: string[],
  ): Promise<T[]> {
    const model = new Model();
    const columnNames = this.getColumnNames(model.tableColumnDefinitions);
    const where = isNullOrEmpty(ids) ? '' : ` WHERE id IN (${ids.join(',')})`;
    const sql = `SELECT ${columnNames} FROM ${model.tableName}${where}`;
    return this.dbGetAll(sql).then((v) => getArrayOfModels(Model, v));
  }

  findOne<T extends IDatabaseModel>(Model: new (o?: Partial<T>) => T, id: string): Promise<T> {
    const model = new Model();
    const columnNames = this.getColumnNames(model.tableColumnDefinitions);
    const sql = `SELECT ${columnNames} FROM ${model.tableName} WHERE id = "${id}"`;
    return this.dbGet(sql).then((v) => new Model(v));
  }

  update<T extends IDatabaseModel>(id: string, value: T): Promise<T> {
    const columnNames = this.getColumnNames(value.tableColumnDefinitions);
    const values = this.getValues(columnNames, value);
    const valueMarkers = columnNames.map((col) => col + '=?').join(',');
    const sql = `UPDATE ${value.tableName} SET ${valueMarkers} WHERE id = "${id}"`;
    return this.dbRun(sql, values).then(() => value);
  }

  remove<T extends IDatabaseModel>(Model: new (o?: Partial<T>) => T, id: string): Promise<T> {
    const model = new Model();
    const sql = `DELETE FROM ${model.tableName} WHERE id = ?`;
    return this.dbRun(sql, [id]);
  }

  dbRun(sql: string, values: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = this.connect();
      db.run(sql, values, (result, err) => {
        if (err == null) {
          resolve(result);
        } else {
          this.logger.error(`Error: dbRun - ${sql}`);
          reject(err);
        }
      });
      this.close(db);
    });
  }

  dbGet(sql: string): Promise<any> {
    // this.logger.log(`dbGet sql: ${sql}`);
    return new Promise((resolve, reject) => {
      const db = this.connect();
      db.get(sql, [], (err: Error, result: any) => {
        if (err == null) {
          resolve(result);
        } else {
          this.logger.error(`Error: dbGet - ${sql}`);
          reject(err);
        }
      });
      this.close(db);
    });
  }

  dbGetAll(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = this.connect();
      db.all(sql, [], (err: Error, result: any[]) => {
        if (err == null) {
          resolve(result);
        } else {
          this.logger.error(`Error: dbGetAll - ${sql}`);
          reject(err);
        }
      });
      this.close(db);
    });
  }

  getColumnNames(tableColumnDefinitions: string[]): string[] {
    return tableColumnDefinitions
      .filter((d) => !['FOREIGN', 'PRIMARY'].includes(d.split(' ')[0]))
      .map((d) => d.split(' ')[0]);
  }

  getValues<T extends IDatabaseModel>(columnNames: string[], value: T): any[] {
    const values = [];
    columnNames.forEach((col) => {
      try {
        values.push(value[col]);
      } catch (err) {
        values.push(null);
      }
    });

    return values;
  }
}
