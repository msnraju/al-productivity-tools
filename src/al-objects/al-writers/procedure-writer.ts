import { commands } from "vscode";
import { Helper } from "../helper";
import { IProcedure } from "../models/IProcedure";
import { IProcedureDeclaration } from "../models/IProcedureDeclaration";
import CommentWriter from "./comment-writer";
import { VariableWriter } from "./variable-writer";

export class ProcedureWriter {
  static write(func: IProcedure, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);

    lines.push(...CommentWriter.write(func.preFunctionComments, indentation));
    lines.push(...CommentWriter.write(func.preFunction, indentation));
    lines.push(this.writeHeader(func.header, indentation));
    lines.push(...CommentWriter.write(func.preVariableComments, indentation));
    lines.push(...VariableWriter.write(func.variables, indentation));
    lines.push(...CommentWriter.write(func.postVariableComments, indentation));
    lines.push(`${pad}${func.body}`);

    return lines;
  }

  private static writeHeader(
    header: IProcedureDeclaration | null,
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
