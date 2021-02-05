import IAction from "./models/action.model";
import ISegment from "./models/segment.model";
import IMethodDeclaration from "./models/method-declaration.model";

export default class Action implements IAction {
  childActions: IAction[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.header = "";
    this.childActions = [];
    this.triggers = [];
    this.segments = [];
    this.comments = [];
    this.properties = [];
  }
}
