import StringHelper from "../string-helper";
import IMethodDeclaration from "../components/models/method-declaration.model";
import StringBuilder from "../models/string-builder";
import VarSectionWriter from "./var-section-writer";

export default class MethodDeclarationWriter {
  static write(method: IMethodDeclaration, indentation: number): string {
    return new StringBuilder()
      .write(method.preMethodComments, indentation)
      .write(method.attributes, indentation)
      .write(this.writeHeader(method, indentation))
      .write(method.preVarSectionComments, indentation)
      .writeIfDefined(method.variables, (variables) =>
        VarSectionWriter.write(variables, indentation)
      )
      .write(method.postVarSectionComments, indentation)
      .write(method.body, indentation)
      .emptyLine()
      .toString();
  }

  private static writeHeader(
    method: IMethodDeclaration,
    indentation: number
  ): string {
    const access = this.getAccess(method);
    const parameters = this.getParameters(method, indentation + 4);
    const returns = this.getReturns(method);

    const pad = StringHelper.pad(indentation);
    const declaration = `${pad}${access}${method.type} ${method.name}(${parameters.sl})${returns}`;
    if (declaration.length > 145) {
      return `${pad}${access}${method.type} ${method.name}(${parameters.ml})${returns}`;
    } else {
      return declaration;
    }
  }

  private static getAccess(method: IMethodDeclaration) {
    if (method.local) {
      return "local ";
    } else if (method.internal) {
      return "internal ";
    }

    return "";
  }

  private static getReturns(method: IMethodDeclaration) {
    if (!method.returnType) {
      return "";
    }

    if (method.returnType.name) {
      return ` ${method.returnType.value.trim()}`;
    } else {
      return method.returnType.value.trim();
    }
  }

  private static getParameters(
    method: IMethodDeclaration,
    indentation: number
  ): { sl: string; ml: string } {
    const paramsBuffer: string[] = [];

    method.parameterList.forEach((param) => {
      paramsBuffer.push(param.value);
    });

    let parameters = paramsBuffer.join(" ");

    const pad = StringHelper.pad(indentation);
    const multiLineParams = `\r\n${pad}${paramsBuffer.join(`\r\n${pad}`)}`;

    return { sl: parameters, ml: multiLineParams };
  }
}
