import { ISegment } from "./ISegment";
import { IFunction } from "./IFunction";
import { IActionContainer } from "./IActionContainer";

export interface IControl {
  actionContainer?: IActionContainer;
  controls: Array<IControl>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}
