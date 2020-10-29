import IControl from "./models/IControl";
import IPageLayout from "./models/page-layout.model";

export default class PageLayout implements IPageLayout {
  keyword: string;
  controls: IControl[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.keyword = "";
    this.controls = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}
