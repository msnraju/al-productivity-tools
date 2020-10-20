import { IAction } from "./IAction";

export interface IActionContainer {
  actions: IAction[];
  preBodyComments: string[];
  comments: string[];
}