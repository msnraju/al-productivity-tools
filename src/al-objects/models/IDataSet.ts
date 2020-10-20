import { IDataItem } from "./IDataItem";

export interface IDataSet {
  dataItems: Array<IDataItem>;
  postLabelComments: string[];
  comments: string[];
}

