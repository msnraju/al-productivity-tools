import IProperty from "./models/property.model";
import ISegment from "./models/segment.model";
import IView from "./models/view.model";

export default class View implements IView {
  comments: string[];
  header: string;
  segments: ISegment[];
  properties: IProperty[];

  constructor() {
    this.comments = [];
    this.header = "";
    this.segments = [];
    this.properties = [];
  }
}
