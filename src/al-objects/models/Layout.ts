import IControl from "./IControl";
import { ILayout } from "./ILayout";

export default class Layout implements ILayout {
  controls: IControl[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.controls = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}
