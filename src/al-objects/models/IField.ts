import ISegment from "./ISegment";
import IProcedure from "./IProcedure";

export default interface IField {
  comments: string[];
  header: string;
  triggers: IProcedure[];
  segments: ISegment[];
  properties: string[];
}