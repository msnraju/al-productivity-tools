import ITableKey from "./models/table-key.model";
import IKeysContainer from "./models/keys-container.model";

export default class KeysContainer implements IKeysContainer {
  keys: ITableKey[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.keys = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}
