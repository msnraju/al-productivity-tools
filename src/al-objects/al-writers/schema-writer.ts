import { Helper } from "../helper";
import { INode } from "../models/INode";
import { ISchema } from "../models/ISchema";
import { NodeWriter } from "./node-writer";

export class SchemaWriter {
  static write(schema: ISchema): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}schema`);
    lines.push(...this.writeComments(schema.postLabelComments, 4));
    lines.push(`${pad}{`);
    lines.push(...this.writeComments(schema.comments, 8));
    lines.push(...this.writeNodes(schema.nodes, 8));
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
      lines.push(...NodeWriter.write(node, indentation));
    });

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!comments || comments.length == 0) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));

    return lines;
  }
}
