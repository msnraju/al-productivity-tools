import { IFieldsContainer } from "../models/IFieldsContainer";
import { Helper } from "../helper";
import { FieldWriter } from "./field-writer";
import { IField } from "../models/IField";

export class FieldsWriter {
  static write(fields: IFieldsContainer): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}fields`);
    lines.push(...FieldsWriter.writeComments(fields.postLabelComments, 4));
    lines.push(`${pad}{`);
    lines.push(...this.writeComments(fields.comments, 8));
    lines.push(...FieldsWriter.writeFields(fields.fields));
    lines.push(`${pad}}`);

    return lines;
  }

  private static writeFields(fields: Array<IField>): string[] {
    const lines: string[] = [];

    if(!fields) return lines;

    fields.forEach((field) => {
      lines.push(...FieldWriter.write(field));
    });

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));

    return lines;
  }
}
