import IControl from "./IControl";

export default interface ILayout {
  controls: IControl[];
  postLabelComments: string[];
  comments: string[];
}
