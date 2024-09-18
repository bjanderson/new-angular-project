import { IHasId } from './has-id.interface';

export interface IDatabaseModel extends IHasId {
  tableName: string;
  tableColumnDefinitions: string[];
}
