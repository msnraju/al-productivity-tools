import _ = require("lodash");
import { IToken } from "./tokenizer";
import { ITokenReader } from "./models/ITokenReader";

export class Helper {
  static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
  }

  static pad(length: number) {
    return _.padStart("", length);
  }

  static tokensToString(tokens: Array<IToken>, keywords: any) {
    const buffer: string[] = [];
    tokens.forEach((token) => {
      if (keywords[token.value.toLowerCase()])
        buffer.push(keywords[token.value.toLowerCase()]);
      else buffer.push(token.value);
    });

    return buffer.join("");
  }

  static readAttribute(tokenReader: ITokenReader, keywords: any): string {
    const tokens: Array<IToken> = [];

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
