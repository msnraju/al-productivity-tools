import { ISegment } from "./ISegment";
import { IFunction } from "./IFunction";

export interface IAction {
  childActions: Array<IAction>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}
