import IMethodDeclaration from "./method-declaration.model";
import ISegment from "./segment.model";

export default interface IDataItem {
  dataItems: Array<IDataItem>;
  comments: string[];
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: string[];
}