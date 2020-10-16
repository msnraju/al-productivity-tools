import { IReadContext } from "../models/IReadContext";
import { IToken } from '../tokenizer';
import { Helper } from '../helper';
import { Keywords } from '../keywords';

export class PropertyReader {
  static readProperties(context: IReadContext): string {
    const tokens: Array<IToken> = [];
    const name = context.tokens[context.pos].value;
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const eq = context.tokens[context.pos].value;
    if (eq !== '=') throw new Error('Error in property reading.');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    while (context.tokens[context.pos].value !== ';') {
      tokens.push(context.tokens[context.pos++]);
    }

    if (context.tokens[context.pos].value !== ';')
      throw new Error('end property error');

    tokens.push(context.tokens[context.pos]);
    context.pos++;
    Helper.readWhiteSpaces(context, []);
    const propertyValue = Helper.tokensToString(tokens, Keywords.Properties);

    return `${name} = ${propertyValue}`;
  }
}
