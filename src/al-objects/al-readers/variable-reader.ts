import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IToken } from "../tokenizer";
import { ITokenReader } from "../models/ITokenReader";
import { IVariable } from "../models/IVariable";
import _ = require("lodash");

export class VariableReader {
  static read(
    tokenReader: ITokenReader,
    returnType: boolean,
    resetIndex: number
  ): IVariable | undefined {
    const variable: IVariable = {
      name: "",
      dataType: "",
      weight: 0,
      preVariable: [],
      value: "",
    };

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
    const tokens: Array<IToken> = [];
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

    return Helper.tokensToString(tokens, Keywords.Variables);
  }

  private static getDataType(tokenReader: ITokenReader): string {
    let dataType = tokenReader.tokenValue().toLowerCase();

    if (Keywords.DataTypes[dataType]) {
      dataType = Keywords.DataTypes[dataType];
    }

    return dataType;
  }

  private static getWeight(tokenReader: ITokenReader, dataType: string) {
    if (dataType.toLowerCase() !== "array") {
      return Keywords.DataTypeWeight[dataType] || 100;
    }

    let pos = tokenReader.pos;
    pos = _.findIndex(
      tokenReader.tokens,
      (item) => item.value.toLowerCase() === "of",
      pos
    );

    if (tokenReader.tokens[pos].value.toLowerCase() === "of") {
      pos++;
      while (tokenReader.tokens[pos].type === "whitespace") pos++;
    }

    const dataType2 = tokenReader.tokens[pos].value.toLowerCase();
    if (Keywords.DataTypes[dataType2]) {
      tokenReader.tokens[pos].value = Keywords.DataTypes[dataType2];
    }

    return Keywords.DataTypeWeight[dataType2] || 100;
  }
}
