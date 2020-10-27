import ISegment from "../models/ISegment";
import IProcedure from "../models/IProcedure";
import IAction from "../models/IAction";

export default class Action implements IAction {
  childActions: IAction[];
  comments: string[];
  header: string;
  triggers: IProcedure[];
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
