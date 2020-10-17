import { IFieldsContainer } from "../models/IFieldsContainer";
import { Helper } from "../helper";
import { FieldWriter } from "./field-writer";

export class FieldsWriter {
  static write(fields: IFieldsContainer): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}fields`);
    if (fields.postLabelComments.length > 0) {
      fields.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (fields.comments.length > 0) {
      fields.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    fields.fields.forEach((field) => {
      const fieldLines = FieldWriter.write(field);
      fieldLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }
}
