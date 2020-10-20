import { IToken } from "../tokenizer";

export interface ITokenReader {
  tokens: Array<IToken>;
  pos: number;

  peekTokenValue(): string;
  peekToken(): IToken;
  token(): IToken;
  tokenType(): string;
  tokenValue(): string;
  test(value: string, errMsg: string): void;

  readWhiteSpaces(tokens?: Array<IToken>): void;
  readComments(): string[];
  next(): void;
}
