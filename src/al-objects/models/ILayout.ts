import { IControl } from "./IControl";

export interface ILayout {
  controls: Array<IControl>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}
