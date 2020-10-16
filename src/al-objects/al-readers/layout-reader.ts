import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { ActionsReader } from "./actions-reader";
import { Keywords } from "../keywords";
import { ILayout } from "../models/ILayout";
import { IControl } from "../models/IControl";

export class LayoutReader {
  static readLayout(context: IReadContext): ILayout {
    const controls: Array<IControl> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== "layout") throw new Error("Invalid layout position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid layout position");
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (
      Keywords.PageControlTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const control = this.readControl(context);
      controls.push(control);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") throw new Error("Invalid layout position");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      controls: controls,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readControl(context: IReadContext): IControl {
    const control: IControl = {
      header: "",
      controls: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (
      Keywords.PageControlTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    )
      throw Error("Invalid control position");

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") throw Error("Invalid control position");
    let counter = 1;
    const headerTokens: Array<IToken> = [];
    while (value !== ")" || counter !== 0) {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    if (value !== ")") throw Error("Invalid control position");
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    control.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    control.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid control position");
    context.pos++;

    let comments: Array<string> = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
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
          control.controls.push(this.readControl(context));
          break;
        case "actions":
          control.actionContainer = ActionsReader.readActions(context);
          break;
        case "trigger":
          control.triggers.push(FunctionReader.readFunction(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            comments.forEach((comment) => control.properties.push(comment));
            comments = [];
            control.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== "}") throw new Error("Invalid control position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return control;
  }
}
