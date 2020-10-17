import { IReadContext } from "../models/IReadContext";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { ILayout } from "../models/ILayout";
import { ControlReader } from "./control-reader";

export class LayoutReader {
  static read(context: IReadContext): ILayout {
    const layout = this.getLayoutInstance();
    this.readLabel(context);

    Helper.readWhiteSpaces(context, []);
    layout.postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    this.readLayoutBody(context, layout);
    Helper.readWhiteSpaces(context, []);

    return layout;
  }

  private static readLayoutBody(context: IReadContext, layout: ILayout) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at layout body, '{' expected.`);
    }

    context.pos++;

    layout.comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (
      Keywords.PageControlTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const control = ControlReader.read(context);
      layout.controls.push(control);
      value = context.tokens[context.pos].value.toLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") {
      throw new Error(`Syntax error at layout body, '}' expected.`);
    }

    context.pos++;
  }

  private static getLayoutInstance(): ILayout {
    return {
      controls: [],
      postLabelComments: [],
      comments: [],
    };
  }

  private static readLabel(context: IReadContext) {
    let name = context.tokens[context.pos].value.toLowerCase();
    if (name !== "layout") {
      throw new Error(`Invalid layout label '${name}'.`);
    }

    context.pos++;
    return name;
  }
}
