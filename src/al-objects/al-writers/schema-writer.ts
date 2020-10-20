import { ISchema } from "../models/ISchema";
import StringBuilder from "../models/string-builder";
import { NodeWriter } from "./node-writer";

export class SchemaWriter {
  static write(schema: ISchema, indentation: number): string {
    return new StringBuilder()
      .write("schema", indentation)
      .write(schema.postLabelComments, indentation)
      .write("{", indentation)
      .write(schema.comments, indentation + 4)
      .writeEach(schema.nodes, (node) =>
        NodeWriter.write(node, indentation + 4)
      )
      .write("}", indentation)
      .toString();
  }
}
