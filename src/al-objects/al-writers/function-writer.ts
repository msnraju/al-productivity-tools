import { commands } from "vscode";
import { Helper } from "../helper";
import { IFunction } from "../models/IFunction";
import { IFunctionHeader } from "../models/IFunctionHeader";
import { VariableWriter } from "./variable-writer";

export class FunctionWriter {
  static write(func: IFunction, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);

    lines.push(...this.writeComments(func.preFunctionComments, indentation));
    lines.push(...this.writeComments(func.preFunction, indentation));
    lines.push(this.writeHeader(func.header, indentation));
    lines.push(...this.writeComments(func.preVariableComments, indentation));
    lines.push(...VariableWriter.write(func.variables, indentation));
    lines.push(...this.writeComments(func.postVariableComments, indentation));
    lines.push(`${pad}${func.body}`);

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((comment) => lines.push(`${pad}${comment}`));

    return lines;
  }

  private static writeHeader(
    header: IFunctionHeader | null,
    indentation: number
  ): string {
    if (header === null) return "";
    const pad2 = Helper.pad(indentation + 4);

    let access = "";
    if (header.local) access = "local ";
    else if (header.internal) access = "internal ";

    let name = "";
    if (header.event) name = `${header.variable}::${header.name}`;
    else name = header.name;

    const paramsBuffer: string[] = [];
    header.parameters.forEach((param) => {
      paramsBuffer.push(param.value);
    });
    let parameters = paramsBuffer.join(" ");

    if (parameters.length > 80) {
      parameters = `\r\n${pad2}${paramsBuffer.join(`\r\n${pad2}`)}`;
    }

    let returns = "";
    if (header.returnType) {
      if (header.returnType.name)
        returns = ` ${header.returnType.value.trim()}`;
      else returns = header.returnType.value.trim();
    }

    const pad = Helper.pad(indentation);
    return `${pad}${access}${header.type} ${header.name}(${parameters})${returns}`;
  }
}
