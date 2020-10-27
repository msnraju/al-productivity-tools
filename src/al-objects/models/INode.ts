import ISegment from "./ISegment";
import IProcedure from "./IProcedure";

export default interface INode {
  nodes: Array<INode>;
  comments: string[];
  header: string;
  triggers: Array<IProcedure>;
  segments: Array<ISegment>;
  properties: string[];
}