import { IField } from "../models/IField";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class FieldWriter {
  static write(field: IField, indentation: number): string {
    return new StringBuilder()
      .write(field.header, indentation)
      .write(field.comments, indentation)
      .write("{", indentation)
      .write(field.properties, indentation + 4)
      .writeEach(field.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation + 4)
      )
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}