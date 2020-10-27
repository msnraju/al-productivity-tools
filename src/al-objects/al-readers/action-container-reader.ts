import { EXTENSION_KEYWORDS, PAGE_ACTION_TYPES } from "../constants";
import IActionContainer from "../models/IActionContainer";
import ActionContainer from "../dto/action-container";
import ActionReader from "./action-reader";
import ITokenReader from "../models/ITokenReader";

export default class ActionContainerReader {
  static read(tokenReader: ITokenReader): IActionContainer {
    const container: IActionContainer = new ActionContainer();

    tokenReader.test("actions", "Invalid actions container position");
    container.preBodyComments = tokenReader.readComments();
    tokenReader.test("{", "Invalid actions container position");
    container.comments = tokenReader.readComments();

    let actionType = tokenReader.peekTokenValue().toLowerCase();
    while (
      PAGE_ACTION_TYPES.indexOf(actionType) !== -1 ||
      EXTENSION_KEYWORDS.indexOf(actionType) !== -1
    ) {
      container.actions.push(ActionReader.read(tokenReader));
      actionType = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Invalid actions container position");

    return container;
  }
}
