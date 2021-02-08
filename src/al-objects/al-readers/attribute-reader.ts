import ITokenReader from "../../tokenizers/models/token-reader.model";
import VARIABLE_KEYWORDS from "../maps/variable-keywords";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";

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

    return TokenReader.tokensToString(tokens, VARIABLE_KEYWORDS);
  }
}
