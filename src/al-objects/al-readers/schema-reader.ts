import { ITokenReader } from "../models/ITokenReader";
import { Keywords } from "../keywords";
import { ISchema } from "../models/ISchema";
import { NodeReader } from "./node-reader";
import Schema from "../dto/schema";

export class SchemaReader {
  static read(tokenReader: ITokenReader): ISchema {
    const schema: ISchema = new Schema();

    this.readLabel(tokenReader);
    schema.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, schema);

    return schema;
  }

  private static readBody(tokenReader: ITokenReader, schema: ISchema) {
    tokenReader.test("{", "Syntax error at schema body, '{' expected.");

    schema.comments = tokenReader.readComments();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (
      Keywords.XmlPortNodeTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const node = NodeReader.read(tokenReader);
      schema.nodes.push(node);
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at schema body, '}' expected.");
  }

  private static readLabel(tokenReader: ITokenReader) {
    let label = tokenReader.tokenValue().toLowerCase();
    if (label !== "schema") {
      throw new Error(`Invalid schema type '${label}'.`);
    }

    tokenReader.readWhiteSpaces();
  }
}
