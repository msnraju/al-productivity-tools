import { IProcedure } from "./IProcedure";
import { ISegment } from "./ISegment";

export interface IDataItem {
  dataItems: Array<IDataItem>;
  comments: string[];
  header: string;
  triggers: Array<IProcedure>;
  segments: Array<ISegment>;
  properties: string[];
}