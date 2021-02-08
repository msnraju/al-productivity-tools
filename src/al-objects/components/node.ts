import ISegment from "./models/segment.model";
import IMethodDeclaration from "./models/method-declaration.model";
import INode from "./models/node.model";

export default class Node implements INode {
  nodes: INode[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.header = "";
    this.nodes = [];
    this.triggers = [];
    this.segments = [];
    this.comments = [];
    this.properties = [];
  }
}
