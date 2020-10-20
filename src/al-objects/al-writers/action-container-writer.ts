import { IActionContainer } from "../models/IActionContainer";
import StringBuilder from "../models/string-builder";
import { ActionWriter } from "./action-writer";

export class ActionContainerWriter {
  static write(container: IActionContainer, indentation: number): string {
    return new StringBuilder()
      .write("actions", indentation)
      .write(container.preBodyComments, indentation)
      .write("{", indentation)
      .write(container.comments, indentation + 4)
      .writeEach(container.actions, (action) =>
        ActionWriter.write(action, indentation + 4)
      )
      .write("}", indentation)
      .toString();
  }
}