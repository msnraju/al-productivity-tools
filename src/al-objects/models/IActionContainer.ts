import { IAction } from "./IAction";

export interface IActionContainer {
  actions: Array<IAction>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}
