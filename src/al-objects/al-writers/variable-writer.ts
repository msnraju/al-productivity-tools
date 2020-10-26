import { IVariable } from "../models/IVariable";
import StringBuilder from "../models/string-builder";

export default class VariableWriter {
  static write(variable: IVariable, indentation: number): string {
    return new StringBuilder()
      .write(variable.preVariable, indentation)
      .write(variable.value, indentation)
      .toString();
  }
}