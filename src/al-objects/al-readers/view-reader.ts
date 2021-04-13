import ITokenReader from "../../tokenizers/models/token-reader.model";
import PropertyReader from "./property-reader";
import IView from "../components/models/view.model";
import View from "../components/view";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import ICodeIndex from "../models/code-index.model";

export default class ViewReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): IView {
    const view: IView = new View();

    view.header = this.readHeader(tokenReader, view);
    view.comments = tokenReader.readComments();
    this.readBody(tokenReader, view, codeIndex);

    return view;
  }

  private static readBody(
    tokenReader: ITokenReader,
    view: IView,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test("{", "Syntax error at view body, '{' expected.");

    tokenReader.readWhiteSpaces();
    let value = tokenReader.peekTokenValue();
    while (value !== "}") {
      if (tokenReader.tokenType() === "comment") {
        const comments = tokenReader.readComments();
        comments.forEach(p => view.properties.push({ name: '//', property: p }));
      } else {
        view.properties.push(PropertyReader.read(tokenReader, codeIndex));
      }

      value = tokenReader.peekTokenValue();
    }

    tokenReader.test("}", "Syntax error at view body, '}' expected.");
  }

  private static readHeader(tokenReader: ITokenReader, view: IView): string {
    const name = this.getLabel(tokenReader);
    tokenReader.test("(", "Syntax error at view declaration, '(' expected.");

    const tokens: IToken[] = [];
    let value = tokenReader.peekTokenValue();
    while (value !== ")") {
      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue();
    }

    tokenReader.test(")", "Syntax error at view declaration, ')' expected.");
    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
  }

  private static getLabel(tokenReader: ITokenReader) {
    const name = tokenReader.tokenValue().toLowerCase();
    if (name !== "view") {
      throw Error("Invalid view position");
    }

    tokenReader.readWhiteSpaces();

    return name;
  }
}
