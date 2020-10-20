import _ = require("lodash");
import { IToken } from "./tokenizer";

export class Helper {
  static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
  }

  static pad(length: number) {
    return _.padStart("", length);
  }

  static tokensToString(tokens: IToken[], keywords: any) {
    const buffer: string[] = [];
    tokens.forEach((token) => {
      if (keywords[token.value.toLowerCase()]) {
        buffer.push(keywords[token.value.toLowerCase()]);
      } else {
        buffer.push(token.value);
      }
    });

    return buffer.join("");
  }
}
