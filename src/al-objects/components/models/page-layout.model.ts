import IALComponent from "./al-component.model";
import IControl from "./control.model";

export default interface IPageLayout extends IALComponent {
  controls: IControl[];
  postLabelComments: string[];
  comments: string[];
}
