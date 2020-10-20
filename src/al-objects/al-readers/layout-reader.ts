import { ITokenReader } from "../models/ITokenReader";
import { Keywords } from "../keywords";
import { ILayout } from "../models/ILayout";
import { ControlReader } from "./control-reader";

export class LayoutReader {
  static read(tokenReader: ITokenReader): ILayout {
    const layout = this.getLayoutInstance();
    this.readLabel(tokenReader);
    layout.postLabelComments = tokenReader.readComments();
    this.readLayoutBody(tokenReader, layout);

    return layout;
  }

  private static readLayoutBody(tokenReader: ITokenReader, layout: ILayout) {
    tokenReader.test("{", "Syntax error at layout body, '{' expected.");

    layout.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (
      Keywords.PageControlTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const control = ControlReader.read(tokenReader);
      layout.controls.push(control);
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("},", "Syntax error at layout body, '}' expected.");
  }

  private static getLayoutInstance(): ILayout {
    return {
      controls: [],
      postLabelComments: [],
      comments: [],
    };
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
