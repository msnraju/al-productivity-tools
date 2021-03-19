import ISegment from "./models/segment.model";
import IMethodDeclaration from "./models/method-declaration.model";
import IField from "./models/field.model";
import IProperty from "./models/property.model";

export default class Field implements IField {
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];

  constructor() {
    this.comments = [];
    this.header = "";
    this.triggers = [];
    this.segments = [];
    this.properties = [];
  }
}
