import { IView } from "./IView";

export interface IViewContainer {
  views: Array<IView>;
  postLabelComments: string[];
  comments: string[];
}