import { IDataItem } from "./IDataItem";

export interface IDataSet {
  dataItems: Array<IDataItem>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}