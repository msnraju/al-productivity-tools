import IDataItem from "../models/IDataItem";
import IDataSet from "../models/IDataSet";

export default class DataSet implements IDataSet {
  dataItems: IDataItem[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.dataItems = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}
