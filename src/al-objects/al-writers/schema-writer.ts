import { Helper } from "../helper";
import { ISchema } from "../models/ISchema";
import { NodeWriter } from "./node-writer";

export class SchemaWriter {
  static write(schema: ISchema): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}schema`);
    if (schema.postLabelComments.length > 0) {
      schema.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (schema.comments.length > 0) {
      schema.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    schema.nodes.forEach((node) => {
      const nodeLines = NodeWriter.write(node, 8);
      nodeLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }
}
