import Action from "../dto/action";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IAction } from "../models/IAction";
import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { ProcedureReader } from "./procedure-reader";
import { PropertyReader } from "./property-reader";

export class ActionReader {
  static read(tokenReader: ITokenReader): IAction {
    const action: IAction = new Action();

    action.header = this.readActionHeader(tokenReader);
    action.comments = tokenReader.readComments();
    this.readBody(tokenReader, action);
    tokenReader.readWhiteSpaces();

    return action;
  }

  private static getActionType(tokenReader: ITokenReader) {
    const actionType = tokenReader.tokenValue().toLowerCase();

    if (
      Keywords.PageActionTypes.indexOf(actionType) === -1 &&
      Keywords.ExtensionKeywords.indexOf(actionType) === -1
    ) {
      throw new Error(`Invalid action type '${actionType}'.`);
    }

    tokenReader.readWhiteSpaces();

    return actionType;
  }

  private static readBody(tokenReader: ITokenReader, action: IAction) {
    let comments: string[] = [];

    tokenReader.test("{", "Syntax error at action declaration, '{' expected.");

    let value = tokenReader.peekTokenValue();
    while (value !== "}") {
      switch (value) {
        case "area":
        case "group":
        case "actions":
        case "action":
        case "separator":
          action.childActions.push(this.read(tokenReader));
          break;
        case "trigger":
          action.triggers.push(ProcedureReader.read(tokenReader, comments));
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            action.properties.push(...comments);
            comments = [];
            action.properties.push(PropertyReader.read(tokenReader));
          }
      }

      value = tokenReader.peekTokenValue();
    }

    tokenReader.test("}", "Syntax error at action declaration, '}' expected.");
  }

  private static readActionHeader(tokenReader: ITokenReader) {
    const tokens: IToken[] = [];
    const name = this.getActionType(tokenReader);

    tokenReader.test("(", "Syntax error at action declaration, '(' expected.");

    while (tokenReader.peekTokenValue() !== ")") {
      tokens.push(tokenReader.token());
    }

    tokenReader.test(")", "Syntax error at action declaration, ')' expected.");
    return `${name}(${Helper.tokensToString(tokens, {})})`;
  }
}
