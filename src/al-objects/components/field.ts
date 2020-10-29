import ISegment from "./models/ISegment";
import IMethodDeclaration from "./models/method-declaration.model";
import IField from "./models/IField";

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
