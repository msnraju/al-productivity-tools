import _ = require("lodash");
import DATATYPE_KEYWORDS from "../maps/data-type-keywords";
import StringHelper from "../string-helper";
import IToken from "../models/IToken";
import ITokenReader from "../models/ITokenReader";
import IVariable from "../models/IVariable";
import Variable from "../dto/variable";
import VARIABLE_KEYWORDS from "../maps/variable-keywords";
import DATATYPE_WEIGHT from "../maps/data-type-weights";

export default class VariableReader {
  static read(
    tokenReader: ITokenReader,
    returnType: boolean,
    resetIndex: number
  ): IVariable | undefined {
    const variable: IVariable = new Variable();

    variable.name = tokenReader.peekTokenValue();
    if (returnType && variable.name === ":") {
      variable.name = "";
    } else {
      tokenReader.next();
    }

    tokenReader.readWhiteSpaces();

    const colon = tokenReader.tokenValue();
    if (colon !== ":") {
      tokenReader.pos = resetIndex;
      return;
    }

    tokenReader.readWhiteSpaces();

    variable.dataType = this.getDataType(tokenReader);
    variable.weight = this.getWeight(tokenReader, variable.dataType);

    const subType = this.getSubType(tokenReader);
    variable.value = `${variable.name}: ${variable.dataType}${subType}`;

    return variable;
  }

  private static getSubType(tokenReader: ITokenReader) {
    const tokens: IToken[] = [];
    let value = tokenReader.peekTokenValue().toLowerCase();
    while (
      value !== ";" &&
      value !== ")" &&
      value !== "var" &&
      value !== "begin"
    ) {
      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    if (value === ";") {
      tokens.push(tokenReader.token());
      tokenReader.readWhiteSpaces();
    }

    return StringHelper.tokensToString(tokens, VARIABLE_KEYWORDS);
  }

  private static getDataType(tokenReader: ITokenReader): string {
    let dataType = tokenReader.tokenValue().toLowerCase();

    if (DATATYPE_KEYWORDS[dataType]) {
      dataType = DATATYPE_KEYWORDS[dataType];
    }

    return dataType;
  }

  private static getWeight(
    tokenReader: ITokenReader,
    dataType: string
  ): number {
    if (dataType.toLowerCase() !== "array") {
      return DATATYPE_WEIGHT[dataType] || 100;
    }

    let pos = tokenReader.pos;
    pos = _.findIndex(
      tokenReader.tokens,
      (item) => item.value.toLowerCase() === "of",
      pos
    );

    if (tokenReader.tokens[pos].value.toLowerCase() === "of") {
      pos++;
      tokenReader.readWhiteSpaces();
    }

    const dataType2 = tokenReader.tokens[pos].value.toLowerCase();
    if (DATATYPE_KEYWORDS[dataType2]) {
      tokenReader.tokens[pos].value = DATATYPE_KEYWORDS[dataType2];
    }

    return DATATYPE_WEIGHT[dataType2] || 100;
  }
}
