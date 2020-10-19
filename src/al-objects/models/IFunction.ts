import { IVariable } from "./IVariable";
import { IFunctionHeader } from "./IFunctionHeader";

export interface IFunction {
  preFunctionComments: string[];
  preFunction: string[];
  header: IFunctionHeader | null;
  weight: number;
  preVariableComments: string[];
  variables: Array<IVariable>;
  postVariableComments: string[];
  body: string;
}
