import IAction from "./IAction";

export default interface IActionContainer {
  actions: IAction[];
  preBodyComments: string[];
  comments: string[];
}