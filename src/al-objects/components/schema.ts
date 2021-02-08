import INode from "./models/node.model";
import ISchema from "./models/schema.model";

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