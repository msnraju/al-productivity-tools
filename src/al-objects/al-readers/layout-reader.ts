import { EXTENSION_KEYWORDS, PAGE_CONTROL_TYPES } from "../constants";
import ITokenReader from "../models/ITokenReader";
import ILayout from "../models/ILayout";
import ControlReader from "./control-reader";
import Layout from "../dto/layout";

export default class LayoutReader {
  static read(tokenReader: ITokenReader): ILayout {
    const layout = new Layout();
    this.readLabel(tokenReader);
    layout.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, layout);

    return layout;
  }

  private static readBody(tokenReader: ITokenReader, layout: ILayout) {
    tokenReader.test("{", "Syntax error at layout body, '{' expected.");

    layout.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (
      PAGE_CONTROL_TYPES.indexOf(value) !== -1 ||
      EXTENSION_KEYWORDS.indexOf(value) !== -1
    ) {
      layout.controls.push(ControlReader.read(tokenReader));
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at layout body, '}' expected.");
  }

  private static readLabel(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "layout") {
      throw new Error(`Invalid layout label '${name}'.`);
    }

    tokenReader.readWhiteSpaces();

    return name;
  }
}
