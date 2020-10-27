import ISegment from "./ISegment";
import IProcedure from "./IProcedure";

export default interface IAction {
  childActions: Array<IAction>;
  comments: string[];
  header: string;
  triggers: Array<IProcedure>;
  segments: Array<ISegment>;
  properties: string[];
}