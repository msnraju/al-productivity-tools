import IVariable from "./IVariable";
import IParameter from "./IParameter";

export default interface IProcedureDeclaration {
  local: boolean;
  internal: boolean;
  type: string;
  name: string;
  variable: string;
  event: boolean;
  parameters: Array<IParameter>;
  returnType: IVariable | undefined;
}