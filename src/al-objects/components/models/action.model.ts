import ISegment from "./segment.model";
import IMethodDeclaration from "./method-declaration.model";

export default interface IAction {
  childActions: Array<IAction>;
  comments: string[];
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: string[];
}