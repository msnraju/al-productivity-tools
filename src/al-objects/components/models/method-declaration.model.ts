import IToken from "../../../tokenizers/models/token.model";
import ICodeIndex from "../../models/code-index.model";
import IVariable from "../../models/variable.model";
import IParameter from "./parameter.model";
import IVarSection from "./var-section.model";

export default interface IMethodDeclaration {
  preMethodComments: string[];
  preVarSectionComments: string[];
  postVarSectionComments: string[];

  attributes: string[];
  local: boolean;
  internal: boolean;
  type: string;
  name: string;
  parameterList: IParameter[];
  returnType?: IVariable;
  variables?: IVarSection;

  body: string;
  weight: number;
  codeIndex: ICodeIndex;
}
