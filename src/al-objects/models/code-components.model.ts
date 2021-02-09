import IMethodDeclaration from "../components/models/method-declaration.model";
import IVariable from "./variable.model";

export default interface ICodeComponents {
  variables: IVariable[];
  triggers: IMethodDeclaration[];
  procedures: IMethodDeclaration[];
  sourceExpressions: string[];
}
