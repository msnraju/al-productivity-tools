import { IDataSet } from "../models/IDataSet";
import { Helper } from "../helper";
import { DataItemWriter } from "./data-item-writer";

export class DataSetWriter {
  static write(dataset: IDataSet): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}dataset`);
    if (dataset.postLabelComments.length > 0) {
      dataset.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (dataset.comments.length > 0) {
      dataset.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    dataset.dataItems.forEach((dataItem) => {
      const dataItemLines = DataItemWriter.write(dataItem, 8);
      dataItemLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }
}
