import IVariable from "../../models/IVariable";
import IParameter from "./IParameter";
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
  // variable: string;
  // event: boolean;
  parameterList: IParameter[];
  returnType?: IVariable;
  variables?: IVarSection;

  body: string;
  weight: number;
}
