import ISegment from "./segment.model";

export default interface IView {
  comments: string[];
  header: string;
  segments: Array<ISegment>;
  properties: string[];
}