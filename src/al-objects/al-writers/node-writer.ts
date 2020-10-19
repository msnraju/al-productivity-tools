import { Helper } from "../helper";
import { IFunction } from "../models/IFunction";
import { INode } from "../models/INode";
import { FunctionWriter } from "./function-writer";

export class NodeWriter {
  static write(node: INode, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);
    const pad2 = Helper.pad(indentation + 4);

    lines.push(`${pad}${node.header}`);
    lines.push(...this.writeComments(node.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeProperties(node.properties, indentation + 4));
    lines.push(...this.writeNodes(node.nodes, indentation + 4));
    lines.push(...this.writeTriggers(node.triggers, indentation + 4));
    this.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }

  private static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
  }

  private static writeTriggers(
    triggers: Array<IFunction>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!triggers) return lines;

    triggers.forEach((trigger) => {
      lines.push(...FunctionWriter.write(trigger, indentation));
    });

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

  private static writeProperties(
    properties: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!properties || properties.length == 0) return lines;

    const pad = Helper.pad(indentation);
    properties.forEach((property) => {
      lines.push(`${pad}${property}`);
    });

    lines.push("");

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((comment) => lines.push(`${pad}${comment}`));

    return lines;
  }
}
