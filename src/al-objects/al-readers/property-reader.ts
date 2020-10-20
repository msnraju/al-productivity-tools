import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { Keywords } from "../keywords";

export class PropertyReader {
  static read(tokenReader: ITokenReader): string {
    const name = this.readPropertyName(tokenReader);
    this.readEquals(tokenReader);
    const propertyValue = this.readValue(tokenReader);

    return `${name} = ${propertyValue}`;
  }

  private static readValue(tokenReader: ITokenReader): string {
    const tokens: IToken[] = [];
    while (tokenReader.peekTokenValue() !== ";") {
      tokens.push(tokenReader.token());
    }

    if (tokenReader.peekTokenValue() !== ";") {
      throw new Error("Syntax error at property, ';' expected.");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();

    return Helper.tokensToString(tokens, Keywords.Properties);
  }

  private static readEquals(tokenReader: ITokenReader) {
    const eq = tokenReader.tokenValue();
    if (eq !== "=") {
      throw new Error("Syntax error at property, '=' expected.");
    }

    tokenReader.readWhiteSpaces();
  }

  private static readPropertyName(tokenReader: ITokenReader) {
    const name = tokenReader.tokenValue();
    tokenReader.readWhiteSpaces();
    return name;
  }
}
