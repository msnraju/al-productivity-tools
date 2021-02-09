import IMethodDeclaration from "./components/models/method-declaration.model";
import ICodeComponents from "./models/code-components.model";
import IVariable from "./models/variable.model";

export default class CodeComponents implements ICodeComponents {
  variables: IVariable[];
  triggers: IMethodDeclaration[];
  procedures: IMethodDeclaration[];
  sourceExpressions: string[];

  constructor() {
    this.variables = [];
    this.triggers = [];
    this.procedures = [];
    this.sourceExpressions = [];
  }
}
