import { IReadContext, ISegment } from "./object-reader";
import { IToken } from "./tokenizer";
import { Helper } from "./helper";
import { FunctionReader, IFunction } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "./keywords";
import _ = require("lodash");

export interface ISchema {
  nodes: Array<INode>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}

export interface INode {
  nodes: Array<INode>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}

export class schemaReader {
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

  static schemaToString(schema: ISchema): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart("", 4);

    lines.push(`${pad}schema`);
    if (schema.postLabelComments.length > 0) {
      schema.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (schema.comments.length > 0) {
      schema.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    schema.nodes.forEach((node) => {
      const nodeLines = this.nodeToString(node, 8);
      nodeLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static nodeToString(node: INode, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart("", indentation);
    const pad12 = _.padStart("", indentation + 4);
    lines.push(`${pad}${node.header}`);
    node.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (node.properties.length > 0) {
      node.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push("");
    }

    if (node.nodes.length > 0) {
      node.nodes.forEach((node2) => {
        const nodeLines = this.nodeToString(node2, indentation + 4);
        nodeLines.forEach((line) => lines.push(line));
      });
    }

    if (node.triggers.length > 0) {
      node.triggers.forEach((trigger) => {
        const triggerLines = FunctionReader.functionToString(
          trigger,
          indentation + 4
        );
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
