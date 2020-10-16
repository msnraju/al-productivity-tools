import { IFunction } from "./IFunction";
import { ISegment } from "./ISegment";

export interface IDataItem {
  dataItems: Array<IDataItem>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}
