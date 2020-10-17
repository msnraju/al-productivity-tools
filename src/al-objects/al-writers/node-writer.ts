import { Helper } from "../helper";
import { INode } from "../models/INode";
import { FunctionWriter } from "./function-writer";

export class NodeWriter {
  static write(node: INode, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);
    const pad2 = Helper.pad(indentation + 4);

    lines.push(`${pad}${node.header}`);
    node.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (node.properties.length > 0) {
      node.properties.forEach((property) => {
        lines.push(`${pad2}${property}`);
      });
      lines.push("");
    }

    if (node.nodes.length > 0) {
      node.nodes.forEach((node2) => {
        const nodeLines = this.write(node2, indentation + 4);
        nodeLines.forEach((line) => lines.push(line));
      });
    }

    if (node.triggers.length > 0) {
      node.triggers.forEach((trigger) => {
        const triggerLines = FunctionWriter.write(trigger, indentation + 4);
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
