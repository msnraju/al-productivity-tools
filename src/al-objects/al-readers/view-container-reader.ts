import { ITokenReader } from "../models/ITokenReader";
import { Keywords } from "../keywords";
import { IViewContainer } from "../models/IViewContainer";
import { ViewReader } from "./view-reader";

export class ViewContainerReader {
  static read(tokenReader: ITokenReader): IViewContainer {
    const container = this.getViewContainerInstance();

    this.readLabel(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IViewContainer
  ) {
    tokenReader.test("{", `Syntax error at views body, '{' expected.`);

    container.comments = tokenReader.readComments();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (Keywords.PageViewTypes.indexOf(value) !== -1) {
      container.views.push(ViewReader.read(tokenReader));
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", `Syntax error at views body, '}' expected.`);
  }

  private static getViewContainerInstance(): IViewContainer {
    return {
      views: [],
      postLabelComments: [],
      comments: [],
    };
  }

  private static readLabel(tokenReader: ITokenReader) {
    let label = tokenReader.tokenValue();
    if (label.toLowerCase() !== "views") {
      throw new Error(`Invalid view container type '${label}'.`);
    }

    tokenReader.readWhiteSpaces();

    return label;
  }
}
