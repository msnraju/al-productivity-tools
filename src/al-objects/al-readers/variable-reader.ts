import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IToken } from "../tokenizer";
import { IReadContext } from "../models/IReadContext";
import { IVariable } from "../models/IVariable";
import _ = require("lodash");

export class VariableReader {
  static read(
    context: IReadContext,
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

    variable.name = context.tokens[context.pos].value;
    if (returnType && variable.name === ":") {
      variable.name = "";
    } else {
      context.pos++;
    }

    Helper.readWhiteSpaces(context, []);

    const colon = context.tokens[context.pos].value;
    context.pos++;
    if (colon !== ":") {
      context.pos = resetIndex;
      return;
    }

    Helper.readWhiteSpaces(context, []);

    variable.dataType = this.getDataType(context);
    variable.weight = this.getWeight(context, variable.dataType);

    const subType = this.getSubType(context);
    variable.value = `${variable.name}: ${variable.dataType}${subType}`;

    return variable;
  }

  private static getSubType(context: IReadContext) {
    const tokens: Array<IToken> = [];
    let value = context.tokens[context.pos].value.toLowerCase();
    while (
      value !== ";" &&
      value !== ")" &&
      value !== "var" &&
      value !== "begin"
    ) {
      tokens.push(context.tokens[context.pos]);
      value = context.tokens[++context.pos].value.toLowerCase();
    }

    if (value === ";") {
      tokens.push(context.tokens[context.pos]);
      context.pos++;
      Helper.readWhiteSpaces(context, []);
    }

    return Helper.tokensToString(tokens, Keywords.Variables);
  }

  private static getDataType(context: IReadContext): string {
    let dataType = context.tokens[context.pos].value.toLowerCase();
    context.pos++;

    if (Keywords.DataTypes[dataType]) {
      dataType = Keywords.DataTypes[dataType];
    }

    return dataType;
  }

  private static getWeight(context: IReadContext, dataType: string) {
    if (dataType.toLowerCase() !== "array") {
      return Keywords.DataTypeWeight[dataType] || 100;
    }

    let pos = context.pos;
    pos = _.findIndex(
      context.tokens,
      (item) => item.value.toLowerCase() === "of",
      pos
    );

    if (context.tokens[pos].value.toLowerCase() === "of") {
      pos++;
      while (context.tokens[pos].type === "whitespace") pos++;
    }

    const dataType2 = context.tokens[pos].value.toLowerCase();
    if (Keywords.DataTypes[dataType2])
      context.tokens[pos].value = Keywords.DataTypes[dataType2];

    return Keywords.DataTypeWeight[dataType2] || 100;
  }
}
