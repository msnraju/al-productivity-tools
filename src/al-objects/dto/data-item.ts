import { IProcedure } from "../models/IProcedure";
import { ISegment } from "../models/ISegment";
import { IDataItem } from "../models/IDataItem";

export default class DataItem implements IDataItem {
  dataItems: IDataItem[];
  comments: string[];
  header: string;
  triggers: IProcedure[];
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
