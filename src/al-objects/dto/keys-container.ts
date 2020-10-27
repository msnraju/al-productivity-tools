import IKey from "../models/IKey";
import IKeysContainer from "../models/IKeysContainer";

export default class KeysContainer implements IKeysContainer {
  keys: IKey[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.keys = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}
