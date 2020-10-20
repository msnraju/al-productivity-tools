import { ITokenReader } from "./models/ITokenReader";
import { IToken } from "./tokenizer";

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
    if (this.tokenValue() !== value) {
      throw new Error(errMsg);
    }

    this.readWhiteSpaces();
  }

  readWhiteSpaces(tokens: Array<IToken> = []) {
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
}
