import IAction from "./models/action.model";
import IActionContainer from "./models/action-container.model";

export default class ActionContainer implements IActionContainer {
  actions: IAction[];
  preBodyComments: string[];
  comments: string[];

  constructor() {
    this.actions = [];
    this.preBodyComments = [];
    this.comments = [];
  }
}
