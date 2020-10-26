import { IDataSet } from "../models/IDataSet";
import { DataItemWriter } from "./data-item-writer";
import StringBuilder from "../models/string-builder";

export class DataSetWriter {
  static write(dataset: IDataSet, indentation: number): string {
    return new StringBuilder()
      .write("dataset", indentation)
      .write(dataset.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(dataset, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(dataset: IDataSet, indentation: number): string {
    return new StringBuilder()
      .write(dataset.comments, indentation)
      .writeEach(dataset.dataItems, (dataItem) =>
        DataItemWriter.write(dataItem, indentation)
      )
      .popEmpty()
      .toString();
  }
}
