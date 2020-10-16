import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { ISchema } from "../models/ISchema";
import { INode } from "../models/INode";

export class SchemaReader {
  static readSchema(context: IReadContext): ISchema {
    const nodes: Array<INode> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== "schema") throw new Error("Invalid schema position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid schema position");
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (
      Keywords.XmlPortNodeTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const node = this.readNode(context);
      nodes.push(node);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") throw new Error("Invalid schema position");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      nodes: nodes,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readNode(context: IReadContext): INode {
    const node: INode = {
      header: "",
      nodes: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (
      Keywords.XmlPortNodeTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    )
      throw Error("Invalid node position");

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") throw Error("Invalid node position");
    let counter = 1;
    const headerTokens: Array<IToken> = [];
    while (value !== ")" || counter !== 0) {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    if (value !== ")") throw Error("Invalid node position");
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    node.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    node.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid node position");
    context.pos++;

    let comments: Array<string> = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== "}") {
      switch (value) {
        case "tableelement":
        case "textelement":
        case "textattribute":
        case "fieldelement":
        case "fieldattribute":
          node.nodes.push(this.readNode(context));
          break;
        case "trigger":
          node.triggers.push(FunctionReader.readFunction(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);

            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            comments.forEach((comment) => node.properties.push(comment));
            comments = [];
            node.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== "}") throw new Error("Invalid node position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return node;
  }
}
