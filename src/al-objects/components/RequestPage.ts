import IRequestPage from "./models/request-page.model";
import ObjectContext from "./object-context";

export default class RequestPage extends ObjectContext implements IRequestPage {
  postLabelComments: string[];
  comments: string[];

  constructor() {
    super();
    this.postLabelComments = [];
    this.comments = [];
  }
}
