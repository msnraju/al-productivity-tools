import INode from "./node.model";

export default interface ISchema {
  nodes: Array<INode>;
  postLabelComments: string[];
  comments: string[];
}