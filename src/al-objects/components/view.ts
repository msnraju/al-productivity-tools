import ISegment from "./models/segment.model";
import IView from "./models/view.model";

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
