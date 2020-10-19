import { IVariable } from "../models/IVariable";
import { Helper } from "../helper";
import _ = require("lodash");
import { comments } from "vscode";

export class VariableWriter {
  static write(variables: Array<IVariable>, indentation: number) {
    if (!variables) return [];

    const pad = Helper.pad(indentation);

    variables = _.sortBy(variables, (item) => item.weight);

    const lines: string[] = [];
    lines.push(`${pad}var`);
    lines.push(...this.writeVariables(variables, indentation + 4));

    return lines;
  }

  private static writeVariables(
    variables: IVariable[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    const pad = Helper.pad(indentation);

    if (!variables) return lines;

    variables.forEach((variable) => {
      lines.push(...this.writeComments(variable.preVariable, indentation));
      lines.push(`${pad}${variable.value}`);
    });

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!comments || comments.length === 0) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));

    return lines;
  }
}
