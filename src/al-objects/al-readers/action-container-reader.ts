import IActionContainer from "../components/models/action-container.model";
import ActionContainer from "../components/action-container";
import ActionReader from "./action-reader";
import ITokenReader from "../../tokenizers/models/token-reader.model";
import EXTENSION_KEYWORDS from "../maps/extension-keywords";
import PAGE_ACTION_TYPES from "../maps/page-action-types";
import ICodeIndex from "../models/code-index.model";

export default class ActionContainerReader {
  static read(
    tokenReader: ITokenReader,
    codeIndex: ICodeIndex
  ): IActionContainer {
    const container: IActionContainer = new ActionContainer();

    tokenReader.test("actions", "Invalid actions container position");
    container.preBodyComments = tokenReader.readComments();
    tokenReader.test("{", "Invalid actions container position");
    container.comments = tokenReader.readComments();

    let actionType = tokenReader.peekTokenValue().toLowerCase();
    while (
      PAGE_ACTION_TYPES.hasItem(actionType) ||
      EXTENSION_KEYWORDS.hasItem(actionType)
    ) {
      container.actions.push(ActionReader.read(tokenReader, codeIndex));
      actionType = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Invalid actions container position");

    return container;
  }
}
