import { IToken } from "../tokenizer";

export interface ISegment {
  name: string;
  tokens: Array<IToken>;
}
