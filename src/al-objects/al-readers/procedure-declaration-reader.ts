import ProcedureDeclaration from "../dto/procedure-declaration";
import IProcedureDeclaration from "../models/IProcedureDeclaration";
import IParameter from "../models/IParameter";
import ITokenReader from "../models/ITokenReader";
import IVariable from "../models/IVariable";
import VariableReader from "./variable-reader";

export default class ProcedureDeclarationReader {
  static read(tokenReader: ITokenReader): IProcedureDeclaration {
    const header: IProcedureDeclaration = new ProcedureDeclaration();

    this.readFunctionScope(tokenReader, header);
    header.type = this.getFunctionType(tokenReader);
    this.readFunctionName(tokenReader, header);
    header.parameters = this.readParameters(tokenReader);
    header.returnType = this.readReturnType(tokenReader);

    let value = tokenReader.peekTokenValue().toLowerCase();
    if (value === ";") {
      tokenReader.next();
      tokenReader.readWhiteSpaces();
    }

    return header;
  }

  private static readFunctionName(
    tokenReader: ITokenReader,
    header: IProcedureDeclaration
  ) {
    header.name = tokenReader.tokenValue();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue();
    if (value !== "::") {
      return;
    }

    tokenReader.next();
    tokenReader.readWhiteSpaces();
    header.event = true;

    header.variable = header.name;
    header.name = tokenReader.tokenValue();
    tokenReader.readWhiteSpaces();
  }

  private static readFunctionScope(
    tokenReader: ITokenReader,
    header: IProcedureDeclaration
  ) {
    let value = tokenReader.peekTokenValue().toLowerCase();

    if (
      value !== "local" &&
      value !== "internal" &&
      value !== "procedure" &&
      value !== "trigger"
    ) {
      throw new Error("Invalid function name");
    }

    if (value === "internal") {
      header.internal = true;
      tokenReader.next();
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    if (value === "local") {
      header.local = true;
      tokenReader.next();
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.readWhiteSpaces();
  }

  private static getFunctionType(tokenReader: ITokenReader) {
    let type = tokenReader.tokenValue().toLowerCase();

    if (type !== "trigger" && type !== "procedure") {
      throw new Error(`Invalid type '${type}'.`);
    }

    tokenReader.readWhiteSpaces();

    return type;
  }

  private static readReturnType(
    tokenReader: ITokenReader
  ): IVariable | undefined {
    let returnType: IVariable | undefined;
    let value = tokenReader.peekTokenValue().toLowerCase();

    if (value !== "begin" && value !== "var" && value !== ";") {
      returnType = VariableReader.read(tokenReader, true, tokenReader.pos);
    }

    return returnType;
  }

  private static readParameters(tokenReader: ITokenReader) {
    const parameters: Array<IParameter> = [];

    tokenReader.test(
      "(",
      "Syntax error at function declaration, '(' expected."
    );

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== ")") {
      let resetIndex = tokenReader.pos;
      let ref = false;

      if (value === "var") {
        ref = true;
        tokenReader.next();
        tokenReader.readWhiteSpaces();
      }

      const variable = VariableReader.read(tokenReader, false, resetIndex);
      if (!variable) {
        throw new Error("Syntax error at function parameters.");
      }

      if (ref) variable.value = "var " + variable.value;

      parameters.push({
        ref: ref,
        ...variable,
      });

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test(
      ")",
      "Syntax error at function declaration, ')' expected."
    );

    return parameters;
  }
}
