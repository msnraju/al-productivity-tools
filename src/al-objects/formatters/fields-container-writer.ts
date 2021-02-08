import IFieldsContainer from "../components/models/fields-container.model";
import FieldWriter from "./field-writer";
import StringBuilder from "../../helpers/string-builder";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class FieldsContainerWriter {
  static write(
    fields: IFieldsContainer,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write("fields", indentation)
      .write(fields.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(fields, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    fields: IFieldsContainer,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(fields.comments, indentation)
      .writeEach(fields.fields, (field) =>
        FieldWriter.write(field, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
