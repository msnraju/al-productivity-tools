import { IVariable } from "./IVariable";
import { IFunctionHeader } from "./IFunctionHeader";

export interface IFunction {
  preFunctionComments: Array<string>;
  preFunction: Array<string>;
  header: IFunctionHeader;
  weight: number;
  preVariableComments: Array<string>;
  variables: Array<IVariable>;
  postVariableComments: Array<string>;
  body: string;
}
