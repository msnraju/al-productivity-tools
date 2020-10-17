import { Helper } from "../helper";
import { IField } from "../models/IField";
import { FunctionWriter } from "./function-writer";

export class FieldWriter {
  static write(field: IField): Array<string> {
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
        const triggerLines = FunctionWriter.write(trigger, 12);
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
