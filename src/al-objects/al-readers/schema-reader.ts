import { EXTENSION_KEYWORDS, XMLPORT_NODE_TYPES } from "../constants";
import ITokenReader from "../models/ITokenReader";
import ISchema from "../components/models/ISchema";
import NodeReader from "./node-reader";
import Schema from "../components/schema";

export default class SchemaReader {
  static read(tokenReader: ITokenReader): ISchema {
    const schema: ISchema = new Schema();

    this.getLabel(tokenReader);
    schema.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, schema);

    return schema;
  }

  private static readBody(tokenReader: ITokenReader, schema: ISchema) {
    tokenReader.test("{", "Syntax error at schema body, '{' expected.");

    schema.comments = tokenReader.readComments();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (
      XMLPORT_NODE_TYPES.indexOf(value) !== -1 ||
      EXTENSION_KEYWORDS.indexOf(value) !== -1
    ) {
      const node = NodeReader.read(tokenReader);
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
