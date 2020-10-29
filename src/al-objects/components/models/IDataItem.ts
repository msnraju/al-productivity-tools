import IMethodDeclaration from "./method-declaration.model";
import ISegment from "./ISegment";

export default interface IDataItem {
  dataItems: Array<IDataItem>;
  comments: string[];
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: string[];
}