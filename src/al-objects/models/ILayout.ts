import { IControl } from "./IControl";

export interface ILayout {
  controls: Array<IControl>;
  postLabelComments: string[];
  comments: string[];
}
