import ISegment from "./models/ISegment";
import IMethodDeclaration from "./models/method-declaration.model";
import IAction from "../components/models/IAction";

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
