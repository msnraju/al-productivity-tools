import { Helper } from "../helper";
import { IField } from "../models/IField";
import CommentWriter from "./comment-writer";
import FunctionsWriter from "./functions-writer";
import PropertiesWriter from "./properties-writer";

export class FieldWriter {
  static write(field: IField): string[] {
    const pad = Helper.pad(8);

    const lines: string[] = [];
    lines.push(`${pad}${field.header}`);
    lines.push(...CommentWriter.write(field.comments, 8));
    lines.push(`${pad}{`);
    lines.push(...PropertiesWriter.write(field.properties, 12));
    lines.push(...FunctionsWriter.write(field.triggers, 12));
    Helper.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }
}
