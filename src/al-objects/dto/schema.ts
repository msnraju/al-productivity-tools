import INode from "../models/INode";
import ISchema from "../models/ISchema";

export default class Schema implements ISchema {
  nodes: INode[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.nodes = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}