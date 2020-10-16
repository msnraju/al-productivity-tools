import { IField } from "../models/IField";
import { IFieldsContainer } from "../models/IFieldsContainer";
import { FunctionWriter } from "./function-writer";
import { Helper } from "../helper";

export class FieldsWriter {
  static fieldsToString(fields: IFieldsContainer): Array<string> {
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
      const fieldLines = this.fieldToString(field);
      fieldLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static fieldToString(field: IField): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(8);
    const pad12 = Helper.pad(12);
    
    lines.push(`${pad}${field.header}`);
    field.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (field.properties.length > 0) {
      field.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push("");
    }

    if (field.triggers.length > 0) {
      field.triggers.forEach((trigger) => {
        const triggerLines = FunctionWriter.functionToString(trigger, 12);
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
