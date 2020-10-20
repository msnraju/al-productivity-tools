import { ISegment } from "./ISegment";

export interface IView {
  comments: string[];
  header: string;
  segments: Array<ISegment>;
  properties: string[];
}