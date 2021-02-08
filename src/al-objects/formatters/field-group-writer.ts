import IFieldGroup from "../components/models/field-group.model";
import StringBuilder from "../../helpers/string-builder";
import TokenReader from "../../tokenizers/token-reader";

export default class FieldGroupWriter {
  static write(fieldGroup: IFieldGroup, indentation: number): string {
    return new StringBuilder()
      .write(
        `${fieldGroup.keyword}(${TokenReader.tokensToString(
          fieldGroup.declaration
        )})`,
        indentation
      )
      .append(fieldGroup.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(fieldGroup, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    fieldGroup: IFieldGroup,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(fieldGroup.properties, indentation)
      .popEmpty()
      .toString();
  }
}
