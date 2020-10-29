import IFieldsContainer from "../components/models/IFieldsContainer";
import FieldWriter from "./field-writer";
import StringBuilder from "../models/string-builder";

export default class FieldsContainerWriter {
  static write(fields: IFieldsContainer, indentation: number): string {
    return new StringBuilder()
      .write("fields", indentation)
      .write(fields.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(fields, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    fields: IFieldsContainer,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(fields.comments, indentation)
      .writeEach(fields.fields, (field) =>
        FieldWriter.write(field, indentation)
      )
      .popEmpty()
      .toString();
  }
}
