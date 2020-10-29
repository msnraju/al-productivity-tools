import ISegment from "./ISegment";
import IMethodDeclaration from "./method-declaration.model";
import IActionContainer from "./IActionContainer";

export default interface IControl {
  container?: IActionContainer;
  controls: Array<IControl>;
  comments: string[];
  header: string;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: string[];
}