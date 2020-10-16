import { Helper } from '../helper';
import { Keywords } from '../keywords';
import { IToken } from '../tokenizer';
import { IReadContext } from "../models/IReadContext";
import { IVariable } from '../models/IVariable';
import _ = require('lodash');

export class VariableReader {
  static readVariable(
    context: IReadContext,
    returnType: boolean,
    resetIndex: number
  ): IVariable | undefined {
    const tokens: Array<IToken> = [];
    let variableName = context.tokens[context.pos].value;
    if (returnType && variableName === ':') variableName = '';
    else context.pos++;

    Helper.readWhiteSpaces(context, []);

    const colon = context.tokens[context.pos].value;
    context.pos++;
    if (colon !== ':') {
      context.pos = resetIndex;
      return;
    }

    Helper.readWhiteSpaces(context, []);

    let dataType = context.tokens[context.pos].value.toLocaleLowerCase();
    context.pos++;

    const weight = VariableReader.getWeight(context, dataType);
    if (Keywords.DataTypes[dataType]) dataType = Keywords.DataTypes[dataType];
    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (
      value !== ';' &&
      value !== ')' &&
      value !== 'var' &&
      value !== 'begin'
    ) {
      tokens.push(context.tokens[context.pos]);
      value = context.tokens[++context.pos].value.toLocaleLowerCase();
    }

    if (value === ';') {
      tokens.push(context.tokens[context.pos]);
      context.pos++;
      Helper.readWhiteSpaces(context, []);
    }

    const variableValue = Helper.tokensToString(tokens, Keywords.Variables);
    return {
      name: variableName,
      dataType: dataType,
      weight: weight,
      preVariable: [],
      value: `${variableName}: ${dataType}${variableValue}`,
    };
  }

  private static getWeight(context: IReadContext, dataType: string) {
    if (dataType == 'array') {
      let pos = context.pos;
      pos = _.findIndex(
        context.tokens,
        (item) => item.value.toLocaleLowerCase() === 'of',
        pos
      );

      if (context.tokens[pos].value.toLocaleLowerCase() === 'of') {
        pos++;
        while (context.tokens[pos].type === 'whitespace') pos++;
      }

      const dataType2 = context.tokens[pos].value.toLocaleLowerCase();
      if (Keywords.DataTypes[dataType2])
        context.tokens[pos].value = Keywords.DataTypes[dataType2];

      return Keywords.DataTypeWeight[dataType2] || 100;
    } else return Keywords.DataTypeWeight[dataType] || 100;
  }

  static readVariables(context: IReadContext): Array<IVariable> {
    const variables: Array<IVariable> = [];
    let preBuffer: Array<string> = [];
    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== 'var') return [];

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let resetIndex = context.pos;
    while (context.pos + 3 < context.tokens.length) {
      // Comments
      if (context.tokens[context.pos].type === 'comment') {
        preBuffer = [...preBuffer, ...Helper.readComments(context)];
        continue;
      }

      // Attributes
      const attribute = Helper.readAttribute(context, Keywords.Variables);
      if (attribute.length > 0) {
        preBuffer.push(attribute);
        continue;
      }

      const variable = this.readVariable(context, false, resetIndex);
      if (variable) {
        variables.push({
          ...variable,
          preVariable: preBuffer,
        });
      } else {
        context.pos = resetIndex;
        break;
      }

      preBuffer = [];
      resetIndex = context.pos;
    }

    Helper.readWhiteSpaces(context, []);
    return variables;
  }
}
