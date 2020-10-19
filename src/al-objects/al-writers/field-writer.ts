import { Helper } from "../helper";
import { IField } from "../models/IField";
import { IFunction } from "../models/IFunction";
import { FunctionWriter } from "./function-writer";

export class FieldWriter {
  static write(field: IField): string[] {
    const pad = Helper.pad(8);

    const lines: string[] = [];
    lines.push(`${pad}${field.header}`);
    lines.push(...this.writeComments(field.comments, 8));
    lines.push(`${pad}{`);
    lines.push(...this.writeProperties(field.properties, 12));
    lines.push(...this.writeTriggers(field.triggers, 12));
    this.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }

  private static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
  }

  private static writeTriggers(
    triggers: Array<IFunction>,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!triggers) return lines;

    triggers.forEach((trigger) => {
      lines.push(...FunctionWriter.write(trigger, indentation));
      lines.push("");
    });

    return lines;
  }

  private static writeProperties(
    properties: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!properties) return lines;

    const pad = Helper.pad(indentation);

    properties.forEach((property) => {
      lines.push(`${pad}${property}`);
    });
    lines.push("");

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if(!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));

    return lines;
  }
}
