import { EXTENSION_KEYWORDS, PAGE_CONTROL_TYPES } from "../constants";
import ITokenReader from "../models/ITokenReader";
import IToken from "../models/IToken";
import StringHelper from "../string-helper";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import ActionContainerReader from "./action-container-reader";
import IControl from "../components/models/IControl";
import Control from "../components/control";

export default class ControlReader {
  static read(tokenReader: ITokenReader): IControl {
    const control: IControl = new Control();

    control.header = this.readControlHeader(tokenReader);
    control.comments = tokenReader.readComments();
    this.readBody(tokenReader, control);

    return control;
  }

  private static readBody(tokenReader: ITokenReader, control: IControl) {
    tokenReader.test("{", "Syntax error at control declaration, '{' expected.");

    let comments: string[] = [];

    tokenReader.readWhiteSpaces();
    let value = tokenReader.peekTokenValue().toLowerCase();
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
          control.controls.push(this.read(tokenReader));
          break;
        case "actions":
          control.container = ActionContainerReader.read(tokenReader);
          break;
        case "trigger":
          control.triggers.push(MethodDeclarationReader.read(tokenReader, comments));
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            control.properties.push(...comments);
            comments = [];
            control.properties.push(PropertyReader.read(tokenReader));
          }
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at control declaration, '}' expected.");
  }

  private static readControlHeader(tokenReader: ITokenReader) {
    const name = this.getControlType(tokenReader);

    tokenReader.test("(", "Syntax error at control declaration, '(' expected.");

    let counter = 1;
    const tokens: IToken[] = [];

    let value = tokenReader.peekTokenValue();
    while (value !== ")" || counter !== 0) {
      tokens.push(tokenReader.token());

      value = tokenReader.peekTokenValue();
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    tokenReader.test(")", "Syntax error at control declaration, ')' expected.");

    return `${name}(${StringHelper.tokensToString(tokens, {})})`;
  }

  private static getControlType(tokenReader: ITokenReader) {
    const controlType = tokenReader.tokenValue().toLowerCase();

    if (
      PAGE_CONTROL_TYPES.indexOf(controlType) === -1 &&
      EXTENSION_KEYWORDS.indexOf(controlType) === -1
    ) {
      throw new Error(`Invalid control type '${controlType}'.`);
    }

    tokenReader.readWhiteSpaces();

    return controlType;
  }
}
