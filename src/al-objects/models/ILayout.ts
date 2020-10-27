import IControl from "./IControl";

export interface ILayout {
  controls: IControl[];
  postLabelComments: string[];
  comments: string[];
}
