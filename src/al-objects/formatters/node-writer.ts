import INode from "../components/models/node.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class NodeWriter {
  static write(
    node: INode,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(node.header, indentation)
      .append(node.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(node, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    node: INode,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(node.properties, indentation)
      .emptyLine()
      .writeEach(node.nodes, (node) =>
        NodeWriter.write(node, formatSetting, indentation)
      )
      .emptyLine()
      .writeEach(node.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
