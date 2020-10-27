import IVariable from "../models/IVariable";
import IParameter from "../models/IParameter";
import IProcedureDeclaration from "../models/IProcedureDeclaration";

export default class ProcedureDeclaration implements IProcedureDeclaration {
  local: boolean;
  internal: boolean;
  type: string;
  name: string;
  variable: string;
  event: boolean;
  parameters: IParameter[];
  returnType: IVariable | undefined;

  constructor() {
    this.local = false;
    this.internal = false;
    this.type = "";
    this.name = "";
    this.variable = "";
    this.event = false;
    this.parameters = [];
    this.returnType = undefined;
  }
}
