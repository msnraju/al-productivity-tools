import { ISegment } from "../models/ISegment";
import { IProcedure } from "../models/IProcedure";
import { INode } from "../models/INode";

export default class Node implements INode {
  nodes: INode[];
  comments: string[];
  header: string;
  triggers: IProcedure[];
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
