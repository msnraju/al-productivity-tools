import { Keywords } from "../keywords";
import { IActionContainer } from "../models/IActionContainer";
import ActionContainer from "../dto/action-container";
import { ActionReader } from "./action-reader";
import { ITokenReader } from "../models/ITokenReader";

export class ActionContainerReader {
  static read(tokenReader: ITokenReader): IActionContainer {
    const container: IActionContainer = new ActionContainer();

    tokenReader.test("actions", "Invalid actions container position");
    container.preBodyComments = tokenReader.readComments();
    tokenReader.test("{", "Invalid actions container position");
    container.comments = tokenReader.readComments();

    let actionType = tokenReader.peekTokenValue().toLowerCase();
    while (
      Keywords.PageActionTypes.indexOf(actionType) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(actionType) !== -1
    ) {
      container.actions.push(ActionReader.read(tokenReader));
      actionType = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Invalid actions container position");

    return container;
  }
}
