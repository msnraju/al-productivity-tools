import { INode } from "./INode";


export interface ISchema {
  nodes: Array<INode>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}
