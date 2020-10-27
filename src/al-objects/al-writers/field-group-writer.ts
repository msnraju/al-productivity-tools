import IFieldGroup from "../models/IFieldGroup";
import StringBuilder from "../models/string-builder";

export default class FieldGroupWriter {
  static write(fieldGroup: IFieldGroup, indentation: number): string {
    return new StringBuilder()
      .write(fieldGroup.header, indentation)
      .append(fieldGroup.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(fieldGroup, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(fieldGroup: IFieldGroup, indentation: number): string {
    return new StringBuilder()
      .write(fieldGroup.properties, indentation)
      .popEmpty()
      .toString();
  }
}
