import ITokenReader from "../../tokenizers/models/token-reader.model";
import PropertyReader from "./property-reader";
import ITableKey from "../components/models/table-key.model";
import Key from "../components/key";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";

export default class KeyReader {
  static read(tokenReader: ITokenReader): ITableKey {
    const key: ITableKey = new Key();

    key.header = this.readHeader(tokenReader);
    key.comments = tokenReader.readComments();
    this.readBody(tokenReader, key);
    tokenReader.readWhiteSpaces();

    return key;
  }

  private static readBody(tokenReader: ITokenReader, key: ITableKey) {
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

    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
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
