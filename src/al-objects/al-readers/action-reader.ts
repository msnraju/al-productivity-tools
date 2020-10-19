import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IAction } from "../models/IAction";
import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";

export class ActionReader {
  static read(context: IReadContext): IAction {
    const action: IAction = this.getActionInstance();

    action.header = this.readActionHeader(context);
    Helper.readWhiteSpaces(context, []);
    action.comments = Helper.readComments(context);
    ActionReader.readActionItems(context, action);
    Helper.readWhiteSpaces(context, []);

    return action;
  }

  private static getActionInstance(): IAction {
    return {
      header: "",
      childActions: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };
  }

  private static getActionType(context: IReadContext) {
    const name = context.tokens[context.pos].value.toLowerCase();
    context.pos++;

    if (
      Keywords.PageActionTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    ) {
      throw new Error(`Invalid action type '${name}'.`);
    }

    return name;
  }

  private static readActionItems(context: IReadContext, action: IAction) {
    let comments: string[] = [];

    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at action declaration, '{' expected.`);
    }
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "area":
        case "group":
        case "actions":
        case "action":
        case "separator":
          const childAction = this.read(context);
          action.childActions.push(childAction);
          break;
        case "trigger":
          action.triggers.push(FunctionReader.read(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            action.properties.push(...comments);
            comments = [];
            action.properties.push(PropertyReader.read(context));
          }
      }

      value = context.tokens[context.pos].value.toLowerCase();
    }

    if (value !== "}") {
      throw new Error(`Syntax error at action declaration, '}' expected.`);
    }
    context.pos++;
  }

  private static readActionHeader(context: IReadContext) {
    const tokens: Array<IToken> = [];
    const name = this.getActionType(context);
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
      throw new Error(`Syntax error at action declaration, '(' expected.`);
    }

    while (value !== ")") {
      tokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
    }

    if (value !== ")") {
      throw new Error(`Syntax error at action declaration, ')' expected.`);
    }

    tokens.push(context.tokens[context.pos]);
    context.pos++;

    return `${name}${Helper.tokensToString(tokens, {})}`;
  }
}
