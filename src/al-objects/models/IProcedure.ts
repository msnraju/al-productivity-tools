import IVariable from "./IVariable";
import IProcedureDeclaration from "./IProcedureDeclaration";

export default interface IProcedure {
  preFunctionComments: string[];
  preFunction: string[];
  header: IProcedureDeclaration | null;
  weight: number;
  preVariableComments: string[];
  variables: Array<IVariable>;
  postVariableComments: string[];
  body: string;
}
