import { IToken } from "../tokenizer";

export interface IReadContext {
  tokens: Array<IToken>;
  pos: number;
}
