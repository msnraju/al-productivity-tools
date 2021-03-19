import ISegment from "./segment.model";
import IMethodDeclaration from "./method-declaration.model";
import IActionContainer from "./action-container.model";
import IProperty from "./property.model";

export default interface IControl {
  container?: IActionContainer;
  controls: Array<IControl>;
  comments: string[];
  type: string;
  name: string;
  sourceExpr: string;
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: IProperty[];
}