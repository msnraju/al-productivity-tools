import { IView } from "../models/IView";
import { IViewContainer } from "../models/IViewContainer";

export default class ViewContainer implements IViewContainer {
  views: IView[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.views = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}
