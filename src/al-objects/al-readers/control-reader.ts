import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { ActionContainerReader } from "./action-container-reader";
import { Keywords } from "../keywords";
import { IControl } from "../models/IControl";

export class ControlReader {
  static read(context: IReadContext): IControl {
    const control: IControl = this.getControlInstance();

    control.header = this.readControlHeader(context);
    Helper.readWhiteSpaces(context, []);
    control.comments = Helper.readComments(context);
    this.readControlItems(context, control);
    Helper.readWhiteSpaces(context, []);

    return control;
  }

  private static getControlInstance(): IControl {
    return {
      header: "",
      controls: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };
  }

  private static readControlItems(context: IReadContext, control: IControl) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at control declaration, '{' expected.`);
    }
    context.pos++;

    let comments: Array<string> = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "area":
        case "group":
        case "cuegroup":
        case "repeater":
        case "grid":
        case "fixed":
        case "part":
        case "systempart":
        case "usercontrol":
        case "field":
        case "label":
          control.controls.push(this.read(context));
          break;
        case "actions":
          control.actionContainer = ActionContainerReader.read(context);
          break;
        case "trigger":
          control.triggers.push(FunctionReader.read(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            control.properties.push(...comments);
            comments = [];
            control.properties.push(PropertyReader.read(context));
          }
      }

      value = context.tokens[context.pos].value.toLowerCase();
    }

    if (value !== "}") {
      throw new Error(`Syntax error at control declaration, '}' expected.`);
    }
    context.pos++;
  }

  private static readControlHeader(context: IReadContext) {
    const name = this.getControlType(context);
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
      throw new Error(`Syntax error at control declaration, '(' expected.`);
    }

    let counter = 1;
    const tokens: Array<IToken> = [];
    while (value !== ")" || counter !== 0) {
      tokens.push(context.tokens[context.pos]);
      context.pos++;

      value = context.tokens[context.pos].value;
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    if (value !== ")") {
      throw new Error(`Syntax error at control declaration, ')' expected.`);
    }

    tokens.push(context.tokens[context.pos]);
    context.pos++;
    return `${name}${Helper.tokensToString(tokens, {})}`;
  }

  private static getControlType(context: IReadContext) {
    const name = context.tokens[context.pos].value.toLowerCase();

    if (
      Keywords.PageControlTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    ) {
      throw new Error(`Invalid control type '${name}'.`);
    }

    context.pos++;
    return name;
  }
}
