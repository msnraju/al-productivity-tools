import IVariable from "../models/IVariable";
import IParameter from "./models/IParameter";
import IMethodDeclaration from "./models/method-declaration.model";
import IVarSection from "./models/var-section.model";

export default class MethodDeclaration implements IMethodDeclaration {
  preMethodComments: string[];
  attributes: string[];
  preVarSectionComments: string[];
  postVarSectionComments: string[];

  local: boolean;
  internal: boolean;
  type: string;
  name: string;
  variable: string;
  event: boolean;
  parameterList: IParameter[];
  variables?: IVarSection;
  returnType?: IVariable;
  body: string;
  weight: number;

  constructor(comments: string[]) {
    this.preMethodComments = comments;
    this.attributes = [];
    this.preVarSectionComments = [];
    this.postVarSectionComments = [];

    this.local = false;
    this.internal = false;
    this.type = "";
    this.name = "";
    this.variable = "";
    this.event = false;
    this.parameterList = [];
    this.returnType = undefined;
    this.body = "";
    this.weight = 0;
  }
}
