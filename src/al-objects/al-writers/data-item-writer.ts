import { Helper } from "../helper";
import { IDataItem } from "../models/IDataItem";
import CommentWriter from "./comment-writer";
import ProceduresWriter from "./procedures-writer";
import PropertiesWriter from "./properties-writer";

export class DataItemWriter {
  static write(dataItem: IDataItem, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}${dataItem.header}`);
    lines.push(...CommentWriter.write(dataItem.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...PropertiesWriter.write(dataItem.properties, indentation + 4));
    lines.push(...this.writeItems(dataItem.dataItems, indentation + 4));
    lines.push(...ProceduresWriter.write(dataItem.triggers, indentation + 4));
    Helper.removeBlankLine(lines);
    lines.push(`${pad}}`);

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
}
