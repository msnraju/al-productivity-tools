import IDataItem from "./IDataItem";

export default interface IDataSet {
  dataItems: Array<IDataItem>;
  postLabelComments: string[];
  comments: string[];
}

