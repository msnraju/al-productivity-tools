import IView from "./models/view.model";
import IViewContainer from "./models/view-container.model";

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
