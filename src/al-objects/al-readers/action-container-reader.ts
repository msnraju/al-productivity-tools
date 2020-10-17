import { IReadContext } from "../models/IReadContext";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IActionContainer } from "../models/IActionContainer";
import { IAction } from "../models/IAction";
import { ActionReader } from "./action-reader";

export class ActionContainerReader {
  static read(context: IReadContext): IActionContainer {
    const actions: Array<IAction> = [];

    let value = context.tokens[context.pos].value.toLowerCase();
    if (value !== "actions") {
      throw new Error("Invalid actions container position");
    }
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error("Invalid actions container position");
    }
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (
      Keywords.PageActionTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const action = ActionReader.read(context);
      actions.push(action);
      value = context.tokens[context.pos].value.toLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") {
      throw new Error("Invalid actions container position");
    }
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      actions: actions,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }
}
