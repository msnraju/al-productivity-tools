import IView from "./view.model";

export default interface IViewContainer {
  views: Array<IView>;
  postLabelComments: string[];
  comments: string[];
}