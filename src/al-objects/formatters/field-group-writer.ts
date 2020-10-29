import IFieldGroup from "../components/models/field-group.model";
import StringBuilder from "../models/string-builder";
import StringHelper from "../string-helper";

export default class FieldGroupWriter {
  static write(fieldGroup: IFieldGroup, indentation: number): string {
    return new StringBuilder()
      .write(
        `${fieldGroup.keyword}(${StringHelper.tokensToString(
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
