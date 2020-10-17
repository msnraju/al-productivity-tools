import { IReadContext } from "../models/IReadContext";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { ISchema } from "../models/ISchema";
import { NodeReader } from "./node-reader";

export class SchemaReader {
  static read(context: IReadContext): ISchema {
    const schema: ISchema = {
      nodes: [],
      postLabelComments: [],
      comments: [],
    };

    this.readLabel(context);

    Helper.readWhiteSpaces(context, []);
    schema.postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    this.readBody(context, schema);
    Helper.readWhiteSpaces(context, []);

    return schema;
  }

  private static readBody(context: IReadContext, schema: ISchema) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at schema body, '{' expected.`);
    }
    context.pos++;

    schema.comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (
      Keywords.XmlPortNodeTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const node = NodeReader.read(context);
      schema.nodes.push(node);
      value = context.tokens[context.pos].value.toLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") {
      throw new Error(`Syntax error at schema body, '}' expected.`);
    }

    context.pos++;
  }

  private static readLabel(context: IReadContext) {
    let label = context.tokens[context.pos].value.toLowerCase();
    if (label !== "schema") {
      throw new Error(`Invalid schema type '${label}'.`);
    }

    context.pos++;
  }
}
