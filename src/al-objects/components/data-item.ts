import IMethodDeclaration from "./models/method-declaration.model";
import ISegment from "./models/segment.model";
import IDataItem from "./models/data-item.model";
import IProperty from "./models/property.model";

export default class DataItem implements IDataItem {
  dataItems: IDataItem[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];

  constructor() {
    this.header = "";
    this.dataItems = [];
    this.triggers = [];
    this.segments = [];
    this.comments = [];
    this.properties = [];
  }
}
