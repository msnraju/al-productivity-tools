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
import ICodeIndex from "../models/code-index.model";

export default class ControlReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): IControl {
    const control: IControl = new Control();

    this.readControlHeader(control, tokenReader, codeIndex);
    control.comments = tokenReader.readComments();
    this.readBody(tokenReader, control, codeIndex);

    return control;
  }

  private static readBody(
    tokenReader: ITokenReader,
    control: IControl,
    codeIndex: ICodeIndex
  ) {
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
          control.controls.push(this.read(tokenReader, codeIndex));
          break;
        case "actions":
          control.container = ActionContainerReader.read(
            tokenReader,
            codeIndex
          );
          break;
        case "trigger":
          control.triggers.push(
            MethodDeclarationReader.read(tokenReader, comments, codeIndex)
          );
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            comments.forEach(p => control.properties.push({ name: '//', property: p }))
            comments = [];
            control.properties.push(
              PropertyReader.read(tokenReader, codeIndex)
            );
          }
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at control declaration, '}' expected.");
  }

  private static readControlHeader(
    control: IControl,
    tokenReader: ITokenReader,
    codeIndex: ICodeIndex
  ) {
    control.type = this.getControlType(tokenReader);

    tokenReader.test("(", "Syntax error at control declaration, '(' expected.");

    let counter = 1;
    const tokens: IToken[] = [];
    const values: string[] = [];

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

    tokenReader.test(")", "Syntax error at control declaration, ')' expected.");
    codeIndex.pushCodeTokens(tokens);
    const elements = TokenReader.tokensToString(tokens, {});

    switch (control.type.toLowerCase()) {
      case 'field':
        control.name = values[0];
        control.sourceExpr = values[1];
        break;
      default:
        control.name = values[0];
        break;
    }

    control.header = `${control.type}(${elements})`;
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
