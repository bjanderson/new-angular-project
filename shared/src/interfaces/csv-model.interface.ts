import { IHasId } from './has-id.interface';

export interface ICSVModel extends IHasId {
  csvHeader: string[];
}
