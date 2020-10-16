import { Helper } from "../helper";
import { IFunction } from "../models/IFunction";
import { IFunctionHeader } from "../models/IFunctionHeader";
import { VariableWriter } from "./variable-writer";

export class FunctionWriter {
  static functionToString(func: IFunction, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);

    if (func.preFunctionComments.length > 0)
      func.preFunctionComments.forEach((comment) =>
        lines.push(`${pad}${comment}`)
      );

    if (func.preFunction.length > 0)
      func.preFunction.forEach((line) => lines.push(`${pad}${line}`));

    lines.push(`${pad}${this.headerToString(func.header, indentation)}`);

    if (func.preVariableComments.length > 0)
      func.preVariableComments.forEach((line) => lines.push(`${pad}${line}`));

    const variableLines = VariableWriter.variablesToString(
      func.variables,
      indentation
    );
    variableLines.forEach((line) => lines.push(line));

    if (func.postVariableComments.length > 0)
      func.postVariableComments.forEach((line) => lines.push(`${pad}${line}`));

    lines.push(`${pad}${func.body}`);
    return lines;
  }

  static headerToString(header: IFunctionHeader, indentation: number): string {
    const pad = Helper.pad(indentation + 4);

    let access = "";
    if (header.local) access = "local ";
    else if (header.internal) access = "internal ";

    let name = "";
    if (header.event) name = `${header.variable}::${header.name}`;
    else name = header.name;

    const paramsBuffer: Array<string> = [];
    header.parameters.forEach((param) => {
      paramsBuffer.push(param.value);
    });
    let parameters = paramsBuffer.join(" ");

    if (parameters.length > 80) {
      parameters = `\r\n${pad}${paramsBuffer.join(`\r\n${pad}`)}`;
    }

    let returns = "";
    if (header.returnType) {
      if (header.returnType.name)
        returns = ` ${header.returnType.value.trim()}`;
      else returns = header.returnType.value.trim();
    }

    return `${access}${header.type} ${header.name}(${parameters})${returns}`;
  }
}
