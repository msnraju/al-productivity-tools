import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { ITokenReader } from "../models/ITokenReader";
import { IVariable } from "../models/IVariable";
import { VariableReader } from "./variable-reader";

export class VariablesReader {
  static read(tokenReader: ITokenReader): Array<IVariable> {
    if (!this.hasVariables(tokenReader)) {
      return [];
    }

    tokenReader.readWhiteSpaces();
    const variables = this.readVariables(tokenReader);
    tokenReader.readWhiteSpaces();
    return variables;
  }

  private static hasVariables(tokenReader: ITokenReader) {
    let value = tokenReader.peekTokenValue();
    if (value.toLowerCase() === "var") {
      tokenReader.next();
      return true;
    }

    return false;
  }

  private static readVariables(tokenReader: ITokenReader): IVariable[] {
    const variables: IVariable[] = [];
    let preBuffer: string[] = [];
    let resetIndex = tokenReader.pos;

    while (tokenReader.pos + 3 < tokenReader.tokens.length) {
      // Comments
      if (tokenReader.tokenType() === "comment") {
        preBuffer.push(...tokenReader.readComments());
        continue;
      }

      // Attributes
      const attribute = Helper.readAttribute(tokenReader, Keywords.Variables);
      if (attribute.length > 0) {
        preBuffer.push(attribute);
        continue;
      }

      const variable = VariableReader.read(tokenReader, false, resetIndex);
      if (!variable) {
        tokenReader.pos = resetIndex;
        return variables;
      }

      variable.preVariable = preBuffer;
      variables.push(variable);

      preBuffer = [];
      resetIndex = tokenReader.pos;
    }

    return variables;
  }
}
