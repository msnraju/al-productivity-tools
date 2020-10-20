import { IFunction } from "../models/IFunction";
import { ISegment } from "../models/ISegment";
import { IDataItem } from "../models/IDataItem";

export default class DataItem implements IDataItem {
  dataItems: IDataItem[];
  comments: string[];
  header: string;
  triggers: IFunction[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.header = "";
    this.dataItems = [];
    this.triggers = [];
    this.segments = [];
    this.comments = [];
    this.properties = [];
  }
}
