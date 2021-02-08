import IAction from "../components/models/action.model";
import ITokenReader from "../../tokenizers/models/token-reader.model";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import Action from "../components/action";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import EXTENSION_KEYWORDS from "../maps/extension-keywords";
import PAGE_ACTION_TYPES from "../maps/page-action-types";

export default class ActionReader {
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
      !PAGE_ACTION_TYPES.hasItem(actionType) &&
      !EXTENSION_KEYWORDS.hasItem(actionType)
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
      switch (value.toLowerCase()) {
        case "area":
        case "group":
        case "actions":
        case "action":
        case "separator":
          action.childActions.push(this.read(tokenReader));
          break;
        case "trigger":
          action.triggers.push(
            MethodDeclarationReader.read(tokenReader, comments)
          );
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
    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
  }
}
