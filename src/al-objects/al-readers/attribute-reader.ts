import { Helper } from "../helper";
import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";

export default class AttributeReader {
  static read(tokenReader: ITokenReader, keywords: any): string {
    const tokens: IToken[] = [];

    let value = tokenReader.peekTokenValue();
    if (value !== "[") {
      return "";
    }

    while (value !== "]") {
      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue();
    }

    if (value !== "]") {
      throw new Error("Invalid Attribute");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();

    return Helper.tokensToString(tokens, keywords);
  }
}
