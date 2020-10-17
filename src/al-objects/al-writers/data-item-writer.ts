import { Helper } from "../helper";
import { IDataItem } from "../models/IDataItem";
import { FunctionWriter } from "./function-writer";

export class DataItemWriter {
  static write(dataItem: IDataItem, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);
    const pad2 = Helper.pad(indentation + 4);

    lines.push(`${pad}${dataItem.header}`);
    dataItem.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    this.writeProperties(dataItem, lines, pad2);
    this.writeItems(dataItem, lines, indentation);
    this.writeTriggers(dataItem, lines, indentation);

    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    lines.push(`${pad}}`);
    return lines;
  }

  private static writeItems(
    dataItem: IDataItem,
    lines: string[],
    indentation: number
  ) {
    if (!dataItem.dataItems) return;

    dataItem.dataItems.forEach((dataItem) => {
      const controlLines = this.write(dataItem, indentation + 4);
      controlLines.forEach((line) => lines.push(line));
    });
  }

  private static writeTriggers(
    dataItem: IDataItem,
    lines: string[],
    indentation: number
  ) {
    if (!dataItem.triggers) return;

    dataItem.triggers.forEach((trigger) => {
      const triggerLines = FunctionWriter.write(
        trigger,
        indentation + 4
      );
      triggerLines.forEach((line) => lines.push(line));
      lines.push("");
    });
  }

  private static writeProperties(
    dataItem: IDataItem,
    lines: string[],
    indentation: string
  ) {
    if (!dataItem.properties) return;

    dataItem.properties.forEach((property) => {
      lines.push(`${indentation}${property}`);
    });

    lines.push("");
  }
}
