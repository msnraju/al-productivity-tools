import IControl from "../components/models/control.model";
import StringBuilder from "../../helpers/string-builder";
import ActionContainerWriter from "./action-container-writer";
import MethodDeclarationWriter from "./method-declaration-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";
import IObjectContext from "../components/models/object-context.model";
import { ObjectHelper } from "../object-helper";

export default class ControlWriter {
  static write(
    control: IControl,
    appObject: IObjectContext,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(this.writeHeader(control, appObject, formatSetting), indentation)
      .append(control.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(control, appObject, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeHeader(
    control: IControl,
    appObject: IObjectContext,
    formatSetting: IFormatSetting
  ) {
    const controlType = control.type.toLowerCase();
    if (
      controlType !== "field" ||
      !control.sourceExpr ||
      control.sourceExpr.startsWith("Rec.") ||
      !formatSetting.qualifyWithRecPrefix
    ) {
      return control.header;
    }

    const sourceExpr = ObjectHelper.fixSourceExpr(
      control.sourceExpr,
      appObject,
      formatSetting.symbols
    );

    if (sourceExpr !== control.sourceExpr) {
      const headerColumns = control.header.split(";");
      headerColumns[1] = headerColumns[1].replace(
        control.sourceExpr,
        sourceExpr
      );
      control.header = headerColumns.join(";");
    }

    return control.header;
  }

  private static writeBody(
    control: IControl,
    appObject: IObjectContext,
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
        ControlWriter.write(control, appObject, formatSetting, indentation)
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
