import StringHelper from "../string-helper";
import ITokenReader from "../models/ITokenReader";
import IToken from "../models/IToken";
import VARIABLE_KEYWORDS from "../maps/variable-keywords";

export default class AttributeReader {
  static read(tokenReader: ITokenReader): string {
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

    return StringHelper.tokensToString(tokens, VARIABLE_KEYWORDS);
  }
}
