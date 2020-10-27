import { ISegment } from "./ISegment";
import { IProcedure } from "./IProcedure";
import { IActionContainer } from "./IActionContainer";

export default interface IControl {
  container?: IActionContainer;
  controls: Array<IControl>;
  comments: string[];
  header: string;
  triggers: Array<IProcedure>;
  segments: Array<ISegment>;
  properties: string[];
}