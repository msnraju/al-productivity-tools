import IActionContainer from "../components/models/action-container.model";
import StringBuilder from "../../helpers/string-builder";
import ActionWriter from "./action-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class ActionContainerWriter {
  static write(
    container: IActionContainer,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write("actions", indentation)
      .write(container.preBodyComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(container, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    container: IActionContainer,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(container.comments, indentation)
      .writeEach(container.actions, (action) =>
        ActionWriter.write(action, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
