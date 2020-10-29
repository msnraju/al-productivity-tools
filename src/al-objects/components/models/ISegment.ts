import IToken from "../../models/IToken";

export default interface ISegment {
  name: string;
  tokens: IToken[];
}
