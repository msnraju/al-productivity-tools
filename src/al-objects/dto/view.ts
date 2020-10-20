import { ISegment } from "../models/ISegment";
import { IView } from "../models/IView";

export default class View implements IView {
  comments: string[];
  header: string;
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.comments = [];
    this.header = "";
    this.segments = [];
    this.properties = [];
  }
}
