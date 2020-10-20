import { IAction } from "../models/IAction";
import { IActionContainer } from "../models/IActionContainer";

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
