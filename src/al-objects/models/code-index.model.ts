import IToken from "../../tokenizers/models/token.model";

export default interface ICodeIndex {
  tokens: string[];
  pushCodeTokens: (tokens: IToken[]) => void;
  findToken: (token: string) => boolean;
}
