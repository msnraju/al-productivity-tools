import IMethodDeclaration from "../components/models/method-declaration.model";
import StringBuilder from "../../helpers/string-builder";
import VarSectionWriter from "./var-section-writer";
import StringHelper from "../../helpers/string-helper";
import IFormatSetting from "../../helpers/models/format-settings.model";
import Tokenizer from "../../tokenizers/tokenizer";
import SYMBOLS from "../maps/symbols-map";
import SYSTEM_FUNCTIONS from "../maps/system-functions-map";
import IToken from "../../tokenizers/models/token.model";

export default class MethodDeclarationWriter {
  static write(
    method: IMethodDeclaration,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(method.preMethodComments, indentation)
      .write(method.attributes, indentation)
      .write(this.writeHeader(method, formatSetting, indentation))
      .write(method.preVarSectionComments, indentation)
      .writeIfDefined(method.variables, (variables) =>
        VarSectionWriter.write(variables, formatSetting, indentation)
      )
      .write(method.postVarSectionComments, indentation)
      .write(this.formatBody(method.body, formatSetting), indentation)
      .emptyLine()
      .toString();
  }

  private static formatBody(
    body: string,
    formatSetting: IFormatSetting
  ): string {
    if (body == "") {
      return body;
    }

    const tokens = Tokenizer.tokenizer(body);
    const buffer: string[] = [];

    function hasParenthesis(tokens: IToken[], pos: number): boolean {
      if (pos + 1 >= tokens.length) {
        return false;
      }

      let token = tokens[pos + 1];
      return token.value === "(";
    }

    function getNextTokenValue(tokens: IToken[], pos: number): string {
      pos++;
      while (pos < tokens.length && tokens[pos].type === "whitespace") {
        // skip
        pos++;
      }

      if (pos < tokens.length) {
        return tokens[pos].value;
      }

      return "";
    }

    let prevTokenValue = "";
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      let tokenValue = token.value;

      if (formatSetting.convertKeywordsToAL) {
        if (SYMBOLS[token.value.toLowerCase()]) {
          tokenValue = SYMBOLS[token.value.toLowerCase()];
        }
      }

      if (formatSetting.appendParenthesisAfterProcedures) {
        const nextTokenValue = getNextTokenValue(tokens, i);

        if (
          prevTokenValue != "::" &&
          nextTokenValue != ":=" &&
          !hasParenthesis(tokens, i) &&
          (SYSTEM_FUNCTIONS[tokenValue.toLowerCase()] ||
            formatSetting.extensionFunctions[tokenValue.toLowerCase()])
        ) {
          tokenValue += "()";
        }
      }

      if (token.type !== "whitespace") {
        prevTokenValue = tokenValue;
      } else {
        prevTokenValue = "";
      }
      buffer.push(tokenValue);
    }

    const newBody = buffer.join("");
    return newBody;
  }

  private static writeHeader(
    method: IMethodDeclaration,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    const access = this.getAccess(method);
    const parameters = this.getParameters(method, indentation + 4);
    const returns = this.getReturns(method);

    const pad = StringHelper.pad(indentation);
    const declaration = `${pad}${access}${method.type} ${method.name}(${parameters.sl})${returns}`;

    if (formatSetting.wrapProcedure === true) {
      if (declaration.length > 145) {
        return `${pad}${access}${method.type} ${method.name}(${parameters.ml})${returns}`;
      }
    }

    return declaration;
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
