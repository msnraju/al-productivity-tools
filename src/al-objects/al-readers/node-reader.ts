import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { INode } from "../models/INode";

export class NodeReader {
  static read(tokenReader: ITokenReader): INode {
    const node = this.getNodeInstance();

    node.header = this.readHeader(tokenReader);
    node.comments = tokenReader.readComments();
    this.readNodeBody(tokenReader, node);
    return node;
  }

  private static readHeader(tokenReader: ITokenReader): string {
    const name = NodeReader.readNodeLabel(tokenReader);

    tokenReader.test("(", "Syntax error at node declaration, '(' expected.");

    let counter = 1;
    let value = tokenReader.peekTokenValue();
    const tokens: Array<IToken> = [];

    while (value !== ")" || counter !== 0) {
      tokens.push(tokenReader.token());

      value = tokenReader.peekTokenValue();
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    tokenReader.test(")", "Syntax error at node declaration, ')' expected.");

    return `${name}(${Helper.tokensToString(tokens, {})})`;
  }

  private static readNodeLabel(tokenReader: ITokenReader) {
    const name = tokenReader.tokenValue().toLowerCase();
    if (
      Keywords.XmlPortNodeTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    ) {
      throw Error("Invalid node position");
    }

    tokenReader.readWhiteSpaces();

    return name;
  }

  private static readNodeBody(tokenReader: ITokenReader, node: INode) {
    tokenReader.test("{", "Syntax error at node body, '{' expected.");

    let comments: string[] = [];

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "tableelement":
        case "textelement":
        case "textattribute":
        case "fieldelement":
        case "fieldattribute":
          node.nodes.push(this.read(tokenReader));
          break;
        case "trigger":
          node.triggers.push(FunctionReader.read(tokenReader, comments));
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(tokenReader.tokenValue());
            tokenReader.readWhiteSpaces();
          } else {
            comments.forEach((comment) => node.properties.push(comment));
            comments = [];
            node.properties.push(PropertyReader.read(tokenReader));
          }
          break;
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at node body, '}' expected.");
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
