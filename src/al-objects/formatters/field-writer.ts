import IField from "../components/models/field.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";

export default class FieldWriter {
  static write(field: IField, indentation: number): string {
    return new StringBuilder()
      .write(field.header, indentation)
      .append(field.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(field, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(field: IField, indentation: number): string {
    return new StringBuilder()
      .write(field.properties, indentation)
      .emptyLine()
      .writeEach(field.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
