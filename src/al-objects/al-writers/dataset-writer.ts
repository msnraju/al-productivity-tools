import { IDataSet } from "../models/IDataSet";
import { Helper } from "../helper";
import { DataItemWriter } from "./data-item-writer";
import { IDataItem } from "../models/IDataItem";

export class DataSetWriter {
  static write(dataset: IDataSet): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}dataset`);
    lines.push(...this.writeComments(dataset.postLabelComments, 4));
    lines.push(`${pad}{`);
    lines.push(...this.writeComments(dataset.comments, 8));
    lines.push(...DataSetWriter.writeDataSetItems(dataset.dataItems, 8));
    lines.push(`${pad}}`);

    return lines;
  }

  private static writeDataSetItems(
    dataItems: Array<IDataItem>,
    indentation: number
  ) {
    const lines: string[] = [];
    if (!dataItems) return lines;

    dataItems.forEach((dataItem) => {
      lines.push(...DataItemWriter.write(dataItem, indentation));
    });

    return lines;
  }

  private static writeComments(comments: string[], indentation: number) {
    const lines: string[] = [];
    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));

    return lines;
  }
}
