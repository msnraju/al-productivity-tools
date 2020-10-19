import { Helper } from "../helper";
import { IDataItem } from "../models/IDataItem";
import { IFunction } from "../models/IFunction";
import { FunctionWriter } from "./function-writer";

export class DataItemWriter {
  static write(dataItem: IDataItem, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}${dataItem.header}`);
    lines.push(...DataItemWriter.writeComments(dataItem.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeProperties(dataItem.properties, indentation + 4));
    lines.push(...this.writeItems(dataItem.dataItems, indentation + 4));
    lines.push(...this.writeTriggers(dataItem.triggers, indentation + 4));
    this.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }

  private static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
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

  private static writeItems(
    dataItems: Array<IDataItem>,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!dataItems) return lines;

    dataItems.forEach((dataItem) => {
      lines.push(...this.write(dataItem, indentation));
    });

    return lines;
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
}
