import { IFieldsContainer } from "../models/IFieldsContainer";
import { Helper } from "../helper";
import { FieldWriter } from "./field-writer";
import { IField } from "../models/IField";
import CommentWriter from "./comment-writer";
import StringBuilder from "../models/string-builder";

export class FieldsContainerWriter {
  static write(fields: IFieldsContainer, indentation: number): string {
    return new StringBuilder()
      .write("fields", indentation)
      .write(fields.postLabelComments, indentation)
      .write("{", indentation)
      .write(fields.comments, indentation + 4)
      .writeEach(fields.fields, (field) =>
        FieldWriter.write(field, indentation + 4)
      )
      .write("}", indentation)
      .toString();
  }
}
