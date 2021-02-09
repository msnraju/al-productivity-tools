import ITokenReader from "../../tokenizers/models/token-reader.model";
import NodeReader from "./node-reader";
import EXTENSION_KEYWORDS from "../maps/extension-keywords";
import XMLPORT_NODE_TYPES from "../maps/xmlport-node-types";
import ICodeIndex from "../models/code-index.model";
import ISchema from "../components/models/schema.model";
import Schema from "../components/schema";

export default class SchemaReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): ISchema {
    const schema: ISchema = new Schema();

    this.getLabel(tokenReader);
    schema.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, schema, codeIndex);

    return schema;
  }

  private static readBody(
    tokenReader: ITokenReader,
    schema: ISchema,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test("{", "Syntax error at schema body, '{' expected.");

    schema.comments = tokenReader.readComments();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (
      XMLPORT_NODE_TYPES.hasItem(value) ||
      EXTENSION_KEYWORDS.hasItem(value)
    ) {
      const node = NodeReader.read(tokenReader, codeIndex);
      schema.nodes.push(node);
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at schema body, '}' expected.");
  }

  private static getLabel(tokenReader: ITokenReader) {
    let label = tokenReader.tokenValue().toLowerCase();
    if (label !== "schema") {
      throw new Error(`Invalid schema type '${label}'.`);
    }

    tokenReader.readWhiteSpaces();
  }
}
