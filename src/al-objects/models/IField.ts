import { ISegment } from "./ISegment";
import { IFunction } from "./IFunction";

export interface IField {
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: string[];
}
