import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { INode } from "../models/INode";

export class NodeReader {
  static read(context: IReadContext): INode {
    const node = this.getNodeInstance();

    node.header = this.readHeader(context);
    Helper.readWhiteSpaces(context, []);
    node.comments = Helper.readComments(context);
    this.readNodeBody(context, node);
    Helper.readWhiteSpaces(context, []);
    return node;
  }

  private static readHeader(context: IReadContext): string {
    const name = NodeReader.readNodeLabel(context);
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
      throw new Error(`Syntax error at node declaration, '(' expected.`);
    }

    let counter = 1;
    const tokens: Array<IToken> = [];
    while (value !== ")" || counter !== 0) {
      tokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    if (value !== ")") {
      throw new Error(`Syntax error at node declaration, ')' expected.`);
    }

    tokens.push(context.tokens[context.pos]);
    context.pos++;

    return `${name}${Helper.tokensToString(tokens, {})}`;
  }

  private static readNodeLabel(context: IReadContext) {
    const name = context.tokens[context.pos].value.toLowerCase();
    if (
      Keywords.XmlPortNodeTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    ) {
      throw Error("Invalid node position");
    }

    context.pos++;
    return name;
  }

  private static readNodeBody(context: IReadContext, node: INode) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at node body, '{' expected.`);
    }

    context.pos++;

    let comments: string[] = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "tableelement":
        case "textelement":
        case "textattribute":
        case "fieldelement":
        case "fieldattribute":
          node.nodes.push(this.read(context));
          break;
        case "trigger":
          node.triggers.push(FunctionReader.read(context, comments));
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
            node.properties.push(PropertyReader.read(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLowerCase();
    }

    if (value !== "}") {
      throw new Error(`Syntax error at node body, '}' expected.`);
    }

    context.pos++;
    return value;
  }

  private static getNodeInstance(): INode {
    return {
      header: "",
      nodes: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };
  }
}
