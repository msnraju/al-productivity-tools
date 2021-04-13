import IMethodDeclaration from "./method-declaration.model";
import IProperty from "./property.model";
import ISegment from "./segment.model";

export default interface IDataItem {
  dataItems: IDataItem[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];
}