import IFormatSetting from "../../helpers/models/format-settings.model";
import StringBuilder from "../../helpers/string-builder";
import IAction from "../components/models/action.model";
import MethodDeclarationWriter from "./method-declaration-writer";

export default class ActionWriter {
  static write(
    action: IAction,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(action.header, indentation)
      .append(action.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(action, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    action: IAction,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    if (
      action.type.toLowerCase() === "action" &&
      formatSetting.setDefaultApplicationArea
    ) {
      const prop = action.properties.find(
        (p) => p.name.toLowerCase() === "applicationarea"
      );

      if (!prop) {
        action.properties.push({
          name: "ApplicationArea",
          property: "ApplicationArea = All;",
        });
      }
    }

    return new StringBuilder()
      .write(
        action.properties.map((p) => p.property),
        indentation
      )
      .emptyLine()
      .writeEach(action.actions, (action) =>
        ActionWriter.write(action, formatSetting, indentation)
      )
      .emptyLine()
      .writeEach(action.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
