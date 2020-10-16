import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IActionContainer } from "../models/IActionContainer";
import { IAction } from "../models/IAction";

export class ActionsReader {
  static readActions(context: IReadContext): IActionContainer {
    const actions: Array<IAction> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== "actions")
      throw new Error("Invalid actions container position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid actions container position");
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (
      Keywords.PageActionTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const action = this.readAction(context);
      actions.push(action);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") throw new Error("Invalid actions container position");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      actions: actions,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readAction(context: IReadContext): IAction {
    const action: IAction = {
      header: "",
      childActions: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (
      Keywords.PageActionTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    )
      throw Error("Invalid action position");

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") throw Error("Invalid action position");

    const headerTokens: Array<IToken> = [];
    while (value !== ")") {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
    }

    if (value !== ")") throw Error("Invalid field position");
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    action.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    action.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid field position");
    context.pos++;

    let comments: Array<string> = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== "}") {
      switch (value) {
        case "area":
        case "group":
        case "actions":
        case "action":
        case "separator":
          const childAction = this.readAction(context);
          action.childActions.push(childAction);
          break;
        case "trigger":
          action.triggers.push(FunctionReader.readFunction(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            comments.forEach((comment) => action.properties.push(comment));
            comments = [];
            action.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== "}") throw new Error("Invalid field position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return action;
  }
}
