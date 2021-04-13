import ISegment from "./segment.model";
import IMethodDeclaration from "./method-declaration.model";
import IProperty from "./property.model";

export default interface INode {
  nodes: Array<INode>;
  comments: string[];
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: IProperty[];
}