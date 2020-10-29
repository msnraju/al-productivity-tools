import INode from "../components/models/INode";
import StringBuilder from "../models/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";

export default class NodeWriter {
  static write(node: INode, indentation: number): string {
    return new StringBuilder()
      .write(node.header, indentation)
      .append(node.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(node, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(node: INode, indentation: number): string {
    return new StringBuilder()
      .write(node.properties, indentation)
      .emptyLine()
      .writeEach(node.nodes, (node) => NodeWriter.write(node, indentation))
      .emptyLine()
      .writeEach(node.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
