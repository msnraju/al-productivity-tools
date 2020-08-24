import { IReadContext, ISegment } from "./object-reader";
import { IToken } from "./tokenizer";
import { Helper } from "./helper";
import { FunctionReader, IFunction } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "./keywords";
import _ = require("lodash");

export interface IActionContainer {
  actions: Array<IAction>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}

export interface IAction {
  childActions: Array<IAction>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}

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

  static actionContainerToString(
    container: IActionContainer,
    indentation: number
  ): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart("", indentation);

    lines.push(`${pad}actions`);
    if (container.postLabelComments.length > 0) {
      container.postLabelComments.forEach((line) =>
        lines.push(`${pad}${line}`)
      );
    }
    lines.push(`${pad}{`);
    if (container.comments.length > 0) {
      container.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    container.actions.forEach((action) => {
      const fieldLines = this.actionToString(action, indentation + 4);
      fieldLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static actionToString(action: IAction, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart("", indentation);
    const pad12 = _.padStart("", indentation + 4);

    lines.push(`${pad}${action.header}`);
    action.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (action.properties.length > 0) {
      action.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push("");
    }

    if (action.childActions.length > 0) {
      action.childActions.forEach((action2) => {
        const fieldLines = this.actionToString(action2, indentation + 4);
        fieldLines.forEach((line) => lines.push(line));
      });
    }

    if (action.triggers.length > 0) {
      lines.push("");
      action.triggers.forEach((trigger) => {
        const triggerLines = FunctionReader.functionToString(
          trigger,
          indentation + 4
        );
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
