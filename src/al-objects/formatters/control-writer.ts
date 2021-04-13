import IControl from "../components/models/control.model";
import StringBuilder from "../../helpers/string-builder";
import ActionContainerWriter from "./action-container-writer";
import MethodDeclarationWriter from "./method-declaration-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class ControlWriter {
  static write(
    control: IControl,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(control.header, indentation)
      .append(control.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(control, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    control: IControl,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    const controlType = control.type.toLowerCase();

    if (
      ["field", "label", "part", "systempart"].indexOf(controlType) !== -1 &&
      formatSetting.setDefaultApplicationArea
    ) {
      const prop = control.properties.find(
        (p) => p.name.toLowerCase() === "applicationarea"
      );

      if (!prop) {
        control.properties.push({
          name: "ApplicationArea",
          property: "ApplicationArea = All;",
        });
      }
    }

    return new StringBuilder()
      .write(
        control.properties.map((p) => p.property),
        indentation
      )
      .emptyLine()
      .writeEach(control.controls, (control) =>
        ControlWriter.write(control, formatSetting, indentation)
      )
      .emptyLine()
      .writeIfDefined(control.container, (container) =>
        ActionContainerWriter.write(container, formatSetting, indentation)
      )
      .emptyLine()
      .writeEach(control.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
