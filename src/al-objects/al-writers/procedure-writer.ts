import { Helper } from "../helper";
import { IProcedure } from "../models/IProcedure";
import { IProcedureDeclaration } from "../models/IProcedureDeclaration";
import StringBuilder from "../models/string-builder";
import { VariableContainerWriter } from "./variable-container-writer";

export class ProcedureWriter {
  static write(func: IProcedure, indentation: number): string {
    return new StringBuilder()
      .write(func.preFunctionComments, indentation)
      .write(func.preFunction, indentation)
      .write(this.writeHeader(func.header, indentation))
      .write(func.preVariableComments, indentation)
      .write(VariableContainerWriter.write(func.variables, indentation))
      .write(func.postVariableComments, indentation)
      .write(func.body, indentation)
      .emptyLine()
      .toString();
  }

  private static writeHeader(
    header: IProcedureDeclaration | null,
    indentation: number
  ): string {
    if (header === null) {
      return "";
    }

    const pad2 = Helper.pad(indentation + 4);

    let access = "";
    if (header.local) {
      access = "local ";
    } else if (header.internal) {
      access = "internal ";
    }

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
