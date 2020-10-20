import { ISegment } from "../models/ISegment";
import { IFunction } from "../models/IFunction";
import { IAction } from "../models/IAction";

export default class Action implements IAction {
  childActions: IAction[];
  comments: string[];
  header: string;
  triggers: IFunction[];
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
