import IControl from "../models/IControl";
import ILayout from "../models/ILayout";

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
