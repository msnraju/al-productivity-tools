import IProperty from "./property.model";
import ISegment from "./segment.model";

export default interface IView {
  comments: string[];
  header: string;
  segments: ISegment[];
  properties: IProperty[];
}