import { IReadContext } from "../models/IReadContext";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IViewContainer } from "../models/IViewContainer";
import { ViewReader } from "./view-reader";

export class ViewContainerReader {
  static read(context: IReadContext): IViewContainer {
    const container = this.getViewContainerInstance();

    this.readLabel(context);

    Helper.readWhiteSpaces(context, []);
    container.postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    this.readBody(context, container);
    Helper.readWhiteSpaces(context, []);

    return container;
  }

  private static readBody(context: IReadContext, container: IViewContainer) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at views body, '{' expected.`);
    }

    context.pos++;

    container.comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (Keywords.PageViewTypes.indexOf(value) !== -1) {
      container.views.push(ViewReader.read(context));
      value = context.tokens[context.pos].value.toLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") {
      throw new Error(`Syntax error at views body, '}' expected.`);
    }

    context.pos++;
  }

  private static getViewContainerInstance(): IViewContainer {
    return {
      views: [],
      postLabelComments: [],
      comments: [],
    };
  }

  private static readLabel(context: IReadContext) {
    let label = context.tokens[context.pos].value;
    if (label.toLowerCase() !== "views") {
      throw new Error(`Invalid view container type '${label}'.`);
    }

    context.pos++;
    return label;
  }
}
