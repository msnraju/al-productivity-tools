import { IVariable } from "../models/IVariable";
import { Helper } from "../helper";
import _ = require("lodash");

export class VariableWriter {
  static variablesToString(variables: Array<IVariable>, indentation: number) {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);
    const pad4 = Helper.pad(indentation + 4);

    if (variables.length > 0) {
      variables = _.sortBy(variables, (item) => item.weight);
      lines.push(`${pad}var`);
      variables.forEach((variable) => {
        if (variable.preVariable.length > 0) {
          variable.preVariable.forEach((line) => lines.push(`${pad4}${line}`));
        }

        lines.push(`${pad4}${variable.value}`);
      });
    }

    return lines;
  }
}
