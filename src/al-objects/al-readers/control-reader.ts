import ITokenReader from "../../tokenizers/models/token-reader.model";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import ActionContainerReader from "./action-container-reader";
import IControl from "../components/models/control.model";
import Control from "../components/control";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import EXTENSION_KEYWORDS from "../maps/extension-keywords";
import PAGE_CONTROL_TYPES from "../maps/page-control-types";

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

    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
  }

  private static getControlType(tokenReader: ITokenReader) {
    const controlType = tokenReader.tokenValue().toLowerCase();

    if (
      !PAGE_CONTROL_TYPES.hasItem(controlType) &&
      !EXTENSION_KEYWORDS.hasItem(controlType) 
    ) {
      throw new Error(`Invalid control type '${controlType}'.`);
    }

    tokenReader.readWhiteSpaces();

    return controlType;
  }
}
