import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IView } from "../models/IView";

export class ViewReader {
  static read(context: IReadContext): IView {
    const view = this.getViewInstance();

    view.header = this.readHeader(context, view);
    Helper.readWhiteSpaces(context, []);
    view.comments = Helper.readComments(context);
    this.readBody(context, view);
    Helper.readWhiteSpaces(context, []);

    return view;
  }

  private static readBody(context: IReadContext, view: IView) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at view body, '{' expected.`);
    }

    context.pos++;

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    while (value !== "}") {
      if (context.tokens[context.pos].type === "comment") {
        view.properties.push(context.tokens[context.pos].value);
        context.pos++;
        Helper.readWhiteSpaces(context, []);
      } else {
        view.properties.push(PropertyReader.read(context));
      }

      value = context.tokens[context.pos].value;
    }

    if (value !== "}") {
      throw new Error(`Syntax error at view body, '}' expected.`);
    }

    context.pos++;
  }

  private static readHeader(context: IReadContext, view: IView): string {
    const name = this.getViewName(context);
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
      throw Error("Invalid view position");
    }

    const headerTokens: Array<IToken> = [];
    while (value !== ")") {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
    }

    if (value !== ")") {
      throw Error("Invalid field position");
    }

    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    return `${name}${Helper.tokensToString(headerTokens, {})}`;
  }

  private static getViewName(context: IReadContext) {
    const name = context.tokens[context.pos].value.toLowerCase();
    if (Keywords.PageViewTypes.indexOf(name) === -1) {
      throw Error("Invalid view position");
    }

    context.pos++;
    return name;
  }

  private static getViewInstance(): IView {
    return {
      header: "",
      segments: [],
      comments: [],
      properties: [],
    };
  }
}
