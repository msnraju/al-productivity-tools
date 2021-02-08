import ITokenReader from "../tokenizers/models/token-reader.model";
import IToken from "../tokenizers/models/token.model";
import IKeyValue from "./models/key-value.model";

export default class TokenReader implements ITokenReader {
  tokens: IToken[];
  pos: number;

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  next(): void {
    this.pos++;
  }

  peekToken(): IToken {
    return this.tokens[this.pos];
  }

  peekTokenValue(): string {
    return this.tokens[this.pos].value;
  }

  token(): IToken {
    return this.tokens[this.pos++];
  }

  tokenType(): string {
    return this.tokens[this.pos].type;
  }

  tokenValue(): string {
    return this.tokens[this.pos++].value;
  }

  test(value: string, errMsg: string) {
    const tokenValue = this.tokenValue();
    if (tokenValue !== value) {
      throw new Error(errMsg);
    }

    this.readWhiteSpaces();
  }

  readWhiteSpaces(tokens: IToken[] = []) {
    while (
      this.pos < this.tokens.length &&
      this.tokens[this.pos].type === "whitespace"
    ) {
      tokens.push(this.tokens[this.pos++]);
    }
  }

  readComments(): string[] {
    const comments: string[] = [];

    this.readWhiteSpaces();
    while (this.tokens[this.pos].type === "comment") {
      comments.push(this.tokenValue());
      this.readWhiteSpaces();
    }

    this.readWhiteSpaces();

    return comments;
  }

  readBracesSegment(): IToken[] {
    const tokens: IToken[] = [];
    let counter = 0;
    let value = this.peekTokenValue();
    while (value !== "}" || counter !== 0) {
      tokens.push(this.token());

      value = this.peekTokenValue();
      if (value === "{") {
        counter++;
      } else if (value === "}") {
        counter--;
      }
    }

    if (this.peekTokenValue() !== "}" || counter !== 0) {
      throw new Error("segment end error.");
    }

    tokens.push(this.token());
    this.readWhiteSpaces();
    return tokens;
  }

  static tokensToString(
    tokens: IToken[],
    keywords: IKeyValue | null = null
  ): string {
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
