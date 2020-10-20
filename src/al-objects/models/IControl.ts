import { ISegment } from "./ISegment";
import { IFunction } from "./IFunction";
import { IActionContainer } from "./IActionContainer";

export interface IControl {
  container?: IActionContainer;
  controls: Array<IControl>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: string[];
}