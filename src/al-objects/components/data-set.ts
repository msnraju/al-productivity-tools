import IDataItem from "./models/data-item.model";
import IDataSet from "./models/data-set.model";

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
