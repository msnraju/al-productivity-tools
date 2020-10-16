import { IVariable } from "./IVariable";
import { IParameter } from "./IParameter";

export interface IFunctionHeader {
  local: boolean;
  internal: boolean;
  type: string;
  name: string;
  variable: string;
  event: boolean;
  parameters: Array<IParameter>;
  returnType: IVariable | undefined;
}
