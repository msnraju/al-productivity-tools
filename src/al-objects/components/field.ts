import ISegment from "./models/segment.model";
import IMethodDeclaration from "./models/method-declaration.model";
import IField from "./models/field.model";

export default class Field implements IField {
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.comments = [];
    this.header = "";
    this.triggers = [];
    this.segments = [];
    this.properties = [];
  }
}
