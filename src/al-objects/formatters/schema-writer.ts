import ISchema from "../components/models/schema.model";
import StringBuilder from "../../helpers/string-builder";
import NodeWriter from "./node-writer";

export default class SchemaWriter {
  static write(schema: ISchema, indentation: number): string {
    return new StringBuilder()
      .write("schema", indentation)
      .write(schema.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(schema, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(schema: ISchema, indentation: number): string {
    return new StringBuilder()
      .write(schema.comments, indentation)
      .writeEach(schema.nodes, (node) => NodeWriter.write(node, indentation))
      .popEmpty()
      .toString();
  }
}
