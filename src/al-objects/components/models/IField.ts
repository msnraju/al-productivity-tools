import ISegment from "./ISegment";
import IMethodDeclaration from "./method-declaration.model";

export default interface IField {
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: string[];
}