import IALComponent from "./al-component.model";
import IControl from "./IControl";

export default interface IPageLayout extends IALComponent {
  controls: IControl[];
  postLabelComments: string[];
  comments: string[];
}
