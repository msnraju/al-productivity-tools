import IField from "../components/models/field.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";
import IProperty from "../components/models/property.model";

export default class FieldWriter {
  static write(
    field: IField,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(field.header, indentation)
      .append(field.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(field, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    field: IField,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    if (formatSetting.setDefaultDataClassification) {
      const prop = field.properties.find(
        (p) => p.name.toLowerCase() === "dataclassification"
      );

      const fieldClass = field.properties.find(
        (p) => p.name.toLowerCase() === "fieldclass"
      );

      if (!prop && FieldWriter.isNormalField(fieldClass)) {
        field.properties.push({
          name: "DataClassification",
          property: "DataClassification = CustomerContent;",
        });
      }
    }

    return new StringBuilder()
      .write(
        field.properties.map((p) => p.property),
        indentation
      )
      .emptyLine()
      .writeEach(field.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }

  static isNormalField(fieldClass: IProperty | undefined) {
    if(!fieldClass) {
      return true;
    }

    return /\s*FieldClass\s*=\s*Normal\s*;\s*/i.test(fieldClass.property);
  }
}
