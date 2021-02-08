import ISchema from "../components/models/schema.model";
import StringBuilder from "../../helpers/string-builder";
import NodeWriter from "./node-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class SchemaWriter {
  static write(
    schema: ISchema,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write("schema", indentation)
      .write(schema.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(schema, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    schema: ISchema,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(schema.comments, indentation)
      .writeEach(schema.nodes, (node) =>
        NodeWriter.write(node, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
