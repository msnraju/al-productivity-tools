import IToken from "../../../tokenizers/models/token.model";

export default interface ISegment {
  name: string;
  tokens: IToken[];
}
