import { IDataItem } from "../models/IDataItem";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class DataItemWriter {
  static write(dataItem: IDataItem, indentation: number): string {
    return new StringBuilder()
      .write(dataItem.header, indentation)
      .write(dataItem.comments, indentation)
      .write("{", indentation)
      .write(dataItem.properties, indentation + 4)
      .writeEach(dataItem.dataItems, (dataItem) =>
        DataItemWriter.write(dataItem, indentation + 4)
      )
      .writeEach(dataItem.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation + 4)
      )
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}
