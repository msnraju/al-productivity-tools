import ITokenReader from "../../tokenizers/models/token-reader.model";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import INode from "../components/models/node.model";
import Node from "../components/node";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import EXTENSION_KEYWORDS from "../maps/extension-keywords";
import XMLPORT_NODE_TYPES from "../maps/xmlport-node-types";
import ICodeIndex from "../models/code-index.model";

export default class NodeReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): INode {
    const node: INode = new Node();

    node.header = this.readHeader(tokenReader);
    node.comments = tokenReader.readComments();
    this.readNodeBody(tokenReader, node, codeIndex);
    return node;
  }

  private static readHeader(tokenReader: ITokenReader): string {
    const name = NodeReader.readNodeLabel(tokenReader);

    tokenReader.test("(", "Syntax error at node declaration, '(' expected.");

    let counter = 1;
    let value = tokenReader.peekTokenValue();
    const tokens: IToken[] = [];

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

    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
  }

  private static readNodeLabel(tokenReader: ITokenReader) {
    const name = tokenReader.tokenValue().toLowerCase();
    if (
      !XMLPORT_NODE_TYPES.hasItem(name) &&
      !EXTENSION_KEYWORDS.hasItem(name)
    ) {
      throw Error("Invalid node position");
    }

    tokenReader.readWhiteSpaces();

    return name;
  }

  private static readNodeBody(
    tokenReader: ITokenReader,
    node: INode,
    codeIndex: ICodeIndex
  ) {
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
          node.nodes.push(this.read(tokenReader, codeIndex));
          break;
        case "trigger":
          node.triggers.push(
            MethodDeclarationReader.read(tokenReader, comments, codeIndex)
          );
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            comments.forEach(p => node.properties.push({ name: '//', property: p }))
            comments = [];
            node.properties.push(PropertyReader.read(tokenReader, codeIndex));
          }
          break;
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at node body, '}' expected.");
  }
}
