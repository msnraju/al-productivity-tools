import { INode } from "./INode";

export interface ISchema {
  nodes: Array<INode>;
  postLabelComments: string[];
  comments: string[];
}