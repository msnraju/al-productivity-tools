import IAction from "./action.model";

export default interface IActionContainer {
  actions: IAction[];
  preBodyComments: string[];
  comments: string[];
}