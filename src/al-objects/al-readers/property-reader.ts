import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { Keywords } from "../keywords";

export class PropertyReader {
  static read(context: IReadContext): string {
    const name = this.readPropertyName(context);

    Helper.readWhiteSpaces(context, []);
    this.readEquals(context);
    Helper.readWhiteSpaces(context, []);
    const propertyValue = this.readValue(context);
    Helper.readWhiteSpaces(context, []);

    return `${name} = ${propertyValue}`;
  }

  private static readValue(context: IReadContext): string {
    const tokens: Array<IToken> = [];
    while (context.tokens[context.pos].value !== ";") {
      tokens.push(context.tokens[context.pos++]);
    }

    if (context.tokens[context.pos].value !== ";") {
      throw new Error("Syntax error at property, ';' expected.");
    }

    tokens.push(context.tokens[context.pos]);
    context.pos++;

    return Helper.tokensToString(tokens, Keywords.Properties);
  }

  private static readEquals(context: IReadContext) {
    const eq = context.tokens[context.pos].value;
    if (eq !== "=") {
      throw new Error("Syntax error at property, '=' expected.");
    }

    context.pos++;
  }

  private static readPropertyName(context: IReadContext) {
    const name = context.tokens[context.pos].value;
    context.pos++;
    return name;
  }
}
