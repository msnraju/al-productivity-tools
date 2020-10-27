import IProcedure from "./IProcedure";
import ISegment from "./ISegment";

export default interface IDataItem {
  dataItems: Array<IDataItem>;
  comments: string[];
  header: string;
  triggers: Array<IProcedure>;
  segments: Array<ISegment>;
  properties: string[];
}