import IAction from "../components/models/action.model";
import ITokenReader from "../../tokenizers/models/token-reader.model";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import Action from "../components/action";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import EXTENSION_KEYWORDS from "../maps/extension-keywords";
import PAGE_ACTION_TYPES from "../maps/page-action-types";
import ICodeIndex from "../models/code-index.model";

export default class ActionReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): IAction {
    const action: IAction = new Action();

    this.readActionHeader(action, tokenReader);
    action.comments = tokenReader.readComments();
    this.readBody(tokenReader, action, codeIndex);
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

  private static readBody(
    tokenReader: ITokenReader,
    action: IAction,
    codeIndex: ICodeIndex
  ) {
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
          action.actions.push(this.read(tokenReader, codeIndex));
          break;
        case "trigger":
          action.triggers.push(
            MethodDeclarationReader.read(tokenReader, comments, codeIndex)
          );
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            comments.forEach(p => action.properties.push({ name: '//', property: p }))
            comments = [];
            action.properties.push(PropertyReader.read(tokenReader, codeIndex));
          }
      }

      value = tokenReader.peekTokenValue();
    }

    tokenReader.test("}", "Syntax error at action declaration, '}' expected.");
  }

  private static readActionHeader(action: IAction, tokenReader: ITokenReader) {
    const tokens: IToken[] = [];
    const type = this.getActionType(tokenReader);
    const values = [];
    let counter = 1;

    tokenReader.test("(", "Syntax error at action declaration, '(' expected.");

    let value = tokenReader.peekTokenValue();
    while (value !== ")" || counter !== 0) {
      if (value.trim() !== '' && value.trim() != ';') {
        values.push(value);
      }

      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue();
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    action.type = type;
    action.name = values[0];

    tokenReader.test(")", "Syntax error at action declaration, ')' expected.");
    action.header = `${type}(${TokenReader.tokensToString(tokens, {})})`;
  }
}
