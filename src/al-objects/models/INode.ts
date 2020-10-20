import { ISegment } from "./ISegment";
import { IProcedure } from "./IProcedure";

export interface INode {
  nodes: Array<INode>;
  comments: string[];
  header: string;
  triggers: Array<IProcedure>;
  segments: Array<ISegment>;
  properties: string[];
}