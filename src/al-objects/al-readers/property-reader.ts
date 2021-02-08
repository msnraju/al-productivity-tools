import PROPERTY_KEYWORDS from "../maps/property-keywords";
import ITokenReader from "../../tokenizers/models/token-reader.model";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";

export default class PropertyReader {
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

    return TokenReader.tokensToString(tokens, PROPERTY_KEYWORDS);
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
