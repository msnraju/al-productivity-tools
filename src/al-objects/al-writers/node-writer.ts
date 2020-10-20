import { INode } from "../models/INode";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class NodeWriter {
  static write(node: INode, indentation: number): string {
    return new StringBuilder()
      .write(node.header, indentation)
      .write(node.comments, indentation)
      .write("{", indentation)
      .write(node.properties, indentation + 4)
      .writeEach(node.nodes, (node) => NodeWriter.write(node, indentation + 4))
      .writeEach(node.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation + 4)
      )
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}
