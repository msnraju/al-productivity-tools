import IToken from "./IToken";

export default interface ITokenReader {
  tokens: IToken[];
  pos: number;

  peekTokenValue(): string;
  peekToken(): IToken;
  token(): IToken;
  tokenType(): string;
  tokenValue(): string;
  test(value: string, errMsg: string): void;

  readWhiteSpaces(tokens?: IToken[]): void;
  readComments(): string[];
  next(): void;
}
