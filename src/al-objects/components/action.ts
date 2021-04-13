import IAction from "./models/action.model";
import ISegment from "./models/segment.model";
import IMethodDeclaration from "./models/method-declaration.model";
import IProperty from "./models/property.model";

export default class Action implements IAction {
  actions: IAction[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];
  type: string;
  name: string;

  constructor() {
    this.header = "";
    this.actions = [];
    this.triggers = [];
    this.segments = [];
    this.comments = [];
    this.properties = [];
    this.type = "";
    this.name = "";
  }
}
