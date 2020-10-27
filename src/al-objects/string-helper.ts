import _ = require("lodash");
import IKeyValue from "../helpers/key-value";
import IToken from "./models/IToken";

export default class StringHelper {
  static pad(length: number): string {
    return _.padStart("", length);
  }

  static tokensToString(tokens: IToken[], keywords: IKeyValue | null = null): string {
    const buffer: string[] = [];
    tokens.forEach((token) => {
      if (keywords !== null && keywords[token.value.toLowerCase()]) {
        buffer.push(keywords[token.value.toLowerCase()]);
      } else {
        buffer.push(token.value);
      }
    });

    return buffer.join("");
  }
}
