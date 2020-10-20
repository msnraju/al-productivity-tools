import { IVariable } from "../models/IVariable";

export default class Variable implements IVariable {
  name: string;
  dataType: string;
  weight: number;
  preVariable: string[];
  value: string;

  constructor() {
    this.name = "";
    this.dataType = "";
    this.weight = 0;
    this.preVariable = [];
    this.value = "";
  }
}
