import ISegment from "./segment.model";
import IMethodDeclaration from "./method-declaration.model";
import IProperty from "./property.model";

export default interface IAction {
  actions: IAction[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];
  type: string;
  name: string;
}