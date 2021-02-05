import ITableKey from "./table-key.model";

export default interface IKeysContainer {
  keys: ITableKey[];
  postLabelComments: string[];
  comments: string[];
}
