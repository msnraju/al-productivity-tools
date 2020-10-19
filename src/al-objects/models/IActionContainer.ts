import { IAction } from "./IAction";

export interface IActionContainer {
  actions: Array<IAction>;
  postLabelComments: string[];
  comments: string[];
}
