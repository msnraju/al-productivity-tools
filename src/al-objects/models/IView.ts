import ISegment from "./ISegment";

export default interface IView {
  comments: string[];
  header: string;
  segments: Array<ISegment>;
  properties: string[];
}