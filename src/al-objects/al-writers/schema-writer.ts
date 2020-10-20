import { Helper } from "../helper";
import { INode } from "../models/INode";
import { ISchema } from "../models/ISchema";
import CommentWriter from "./comment-writer";
import { NodeWriter } from "./node-writer";

export class SchemaWriter {
  static write(schema: ISchema): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}schema`);
    lines.push(...CommentWriter.write(schema.postLabelComments, 4));
    lines.push(`${pad}{`);
    lines.push(...CommentWriter.write(schema.comments, 8));
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
}
