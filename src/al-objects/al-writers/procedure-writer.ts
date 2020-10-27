import StringHelper from "../string-helper";
import IProcedure from "../models/IProcedure";
import IProcedureDeclaration from "../models/IProcedureDeclaration";
import StringBuilder from "../models/string-builder";
import VariableContainerWriter from "./variable-container-writer";

export default class ProcedureWriter {
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

    const access = this.getAccess(header);
    const name = this.getName(header);
    const parameters = this.getParameters(header, indentation + 4);
    const returns = this.getReturns(header);

    const pad = StringHelper.pad(indentation);
    const procDeclaration = `${pad}${access}${header.type} ${name}(${parameters.s})${returns}`;
    if (procDeclaration.length > 145) {
      return `${pad}${access}${header.type} ${name}(${parameters.m})${returns}`;
    } else {
      return procDeclaration;
    }
  }

  private static getName(header: IProcedureDeclaration) {
    if (header.event) {
      return `${header.variable}::${header.name}`;
    }

    return header.name;
  }

  private static getAccess(header: IProcedureDeclaration) {
    if (header.local) {
      return "local ";
    } else if (header.internal) {
      return "internal ";
    }

    return "";
  }

  private static getReturns(header: IProcedureDeclaration) {
    if (!header.returnType) {
      return "";
    }

    if (header.returnType.name) {
      return ` ${header.returnType.value.trim()}`;
    } else {
      return header.returnType.value.trim();
    }
  }

  private static getParameters(
    header: IProcedureDeclaration,
    indentation: number
  ): { s: string; m: string } {
    const paramsBuffer: string[] = [];

    header.parameters.forEach((param) => {
      paramsBuffer.push(param.value);
    });

    let parameters = paramsBuffer.join(" ");

    const pad = StringHelper.pad(indentation);
    const multiLineParams = `\r\n${pad}${paramsBuffer.join(`\r\n${pad}`)}`;

    return { s: parameters, m: multiLineParams };
  }
}
