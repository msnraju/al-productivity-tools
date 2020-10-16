import { IView } from "./IView";


export interface IViewContainer {
  views: Array<IView>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}
