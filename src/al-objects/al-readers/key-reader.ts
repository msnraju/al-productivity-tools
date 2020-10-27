import ITokenReader from "../models/ITokenReader";
import IToken from "../models/IToken";
import StringHelper from "../string-helper";
import PropertyReader from "./property-reader";
import IKey from "../models/IKey";
import Key from "../dto/key";

export default class KeyReader {
  static read(tokenReader: ITokenReader): IKey {
    const key: IKey = new Key();

    key.header = this.readHeader(tokenReader);
    key.comments = tokenReader.readComments();
    this.readBody(tokenReader, key);
    tokenReader.readWhiteSpaces();

    return key;
  }

  private static readBody(tokenReader: ITokenReader, key: IKey) {
    tokenReader.test("{", "Syntax error at Key declaration, '{' expected.");

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      if (tokenReader.tokenType() === "comment") {
        key.properties.push(...tokenReader.readComments());
      } else {
        key.properties.push(PropertyReader.read(tokenReader));
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at Key declaration, '}' expected.");
  }

  private static readHeader(tokenReader: ITokenReader): string {
    let name = this.getLabel(tokenReader);

    tokenReader.test("(", "Syntax error at Key declaration, '(' expected.");

    const tokens: IToken[] = [];
    while (tokenReader.peekTokenValue() !== ")") {
      tokens.push(tokenReader.token());
    }

    tokenReader.test(")", "Syntax error at Key declaration, ')' expected.");

    return `${name}(${StringHelper.tokensToString(tokens, {})})`;
  }

  private static getLabel(tokenReader: ITokenReader) {
    let label = tokenReader.tokenValue().toLowerCase();
    if (label !== "key") {
      throw new Error(`Invalid key label '${label}'.`);
    }

    tokenReader.readWhiteSpaces();

    return label;
  }
}
