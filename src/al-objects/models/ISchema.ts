import INode from "./INode";

export default interface ISchema {
  nodes: Array<INode>;
  postLabelComments: string[];
  comments: string[];
}