import { Helper } from "../helper";
import { INode } from "../models/INode";
import CommentWriter from "./comment-writer";
import FunctionsWriter from "./functions-writer";
import PropertiesWriter from "./properties-writer";

export class NodeWriter {
  static write(node: INode, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);

    lines.push(`${pad}${node.header}`);
    lines.push(...CommentWriter.write(node.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...PropertiesWriter.write(node.properties, indentation + 4));
    lines.push(...this.writeNodes(node.nodes, indentation + 4));
    lines.push(...FunctionsWriter.write(node.triggers, indentation + 4));
    Helper.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }

  private static writeNodes(
    nodes: Array<INode>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!nodes) return lines;

    nodes.forEach((node) => {
      lines.push(...this.write(node, indentation));
    });

    return lines;
  }
}
