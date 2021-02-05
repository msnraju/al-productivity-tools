import IActionContainer from "../components/models/action-container.model";
import StringBuilder from "../../helpers/string-builder";
import ActionWriter from "./action-writer";

export default class ActionContainerWriter {
  static write(container: IActionContainer, indentation: number): string {
    return new StringBuilder()
      .write("actions", indentation)
      .write(container.preBodyComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(container, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    container: IActionContainer,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(container.comments, indentation)
      .writeEach(container.actions, (action) =>
        ActionWriter.write(action, indentation)
      )
      .popEmpty()
      .toString();
  }
}
