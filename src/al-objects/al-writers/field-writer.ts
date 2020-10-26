import { IField } from "../models/IField";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class FieldWriter {
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
        ProcedureWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
