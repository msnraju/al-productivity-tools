import IVariable from "../models/IVariable";
import IProcedureDeclaration from "../models/IProcedureDeclaration";
import IProcedure from "../models/IProcedure";

export default class Procedure implements IProcedure {
  preFunctionComments: string[];
  preFunction: string[];
  header: IProcedureDeclaration | null;
  weight: number;
  preVariableComments: string[];
  variables: IVariable[];
  postVariableComments: string[];
  body: string;

  constructor(comments: string[]) {
    this.preFunctionComments = comments;
    this.preFunction = [];
    this.weight = 0;
    this.header = null;
    this.preVariableComments = [];
    this.variables = [];
    this.postVariableComments = [];
    this.body = "";
  }
}
