import ISegment from "./ISegment";
import IMethodDeclaration from "./method-declaration.model";

export default interface INode {
  nodes: Array<INode>;
  comments: string[];
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: string[];
}