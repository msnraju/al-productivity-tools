import _ = require("lodash");
import { IVariable } from "../models/IVariable";
import { Helper } from "../helper";
import CommentWriter from "./comment-writer";

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
      lines.push(...CommentWriter.write(variable.preVariable, indentation));
      lines.push(`${pad}${variable.value}`);
    });

    return lines;
  }
}
