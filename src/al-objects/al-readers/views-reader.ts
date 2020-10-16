import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IViewContainer } from "../models/IViewContainer";
import { IView } from "../models/IView";

export class ViewsReader {
  static readViews(context: IReadContext): IViewContainer {
    const views: Array<IView> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== "views") {
      throw new Error("Invalid views container position");
    }

    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error("Invalid views container position");
    }

    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (Keywords.PageViewTypes.indexOf(value) !== -1) {
      const view = this.readView(context);
      views.push(view);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") throw new Error("Invalid views container position");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      views: views,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readView(context: IReadContext): IView {
    const view: IView = {
      header: "",
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (Keywords.PageViewTypes.indexOf(name) === -1)
      throw Error("Invalid view position");

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") throw Error("Invalid view position");

    const headerTokens: Array<IToken> = [];
    while (value !== ")") {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
    }

    if (value !== ")") throw Error("Invalid field position");
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    view.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    view.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid field position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== "}") {
      switch (value) {
        default:
          if (context.tokens[context.pos].type === "comment") {
            view.properties.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            view.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== "}") throw new Error("Invalid field position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return view;
  }
}
