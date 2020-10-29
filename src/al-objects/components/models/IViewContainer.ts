import IView from "./IView";

export default interface IViewContainer {
  views: Array<IView>;
  postLabelComments: string[];
  comments: string[];
}