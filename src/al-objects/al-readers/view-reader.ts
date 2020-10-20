import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IView } from "../models/IView";
import View from "../dto/view";

export class ViewReader {
  static read(tokenReader: ITokenReader): IView {
    const view: IView = new View();

    view.header = this.readHeader(tokenReader, view);
    view.comments = tokenReader.readComments();
    this.readBody(tokenReader, view);

    return view;
  }

  private static readBody(tokenReader: ITokenReader, view: IView) {
    tokenReader.test("{", "Syntax error at view body, '{' expected.");

    tokenReader.readWhiteSpaces();
    let value = tokenReader.peekTokenValue();
    while (value !== "}") {
      if (tokenReader.tokenType() === "comment") {
        view.properties.push(...tokenReader.readComments());
      } else {
        view.properties.push(PropertyReader.read(tokenReader));
      }

      value = tokenReader.peekTokenValue();
    }

    tokenReader.test("}", "Syntax error at view body, '}' expected.");
  }

  private static readHeader(tokenReader: ITokenReader, view: IView): string {
    const name = this.getViewName(tokenReader);
    tokenReader.test("(", "Syntax error at view declaration, '(' expected.");

    const tokens: IToken[] = [];
    let value = tokenReader.peekTokenValue();
    while (value !== ")") {
      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue();
    }

    tokenReader.test(")", "Syntax error at view declaration, ')' expected.");
    return `${name}(${Helper.tokensToString(tokens, {})})`;
  }

  private static getViewName(tokenReader: ITokenReader) {
    const name = tokenReader.tokenValue().toLowerCase();
    if (Keywords.PageViewTypes.indexOf(name) === -1) {
      throw Error("Invalid view position");
    }

    tokenReader.readWhiteSpaces();

    return name;
  }
}
