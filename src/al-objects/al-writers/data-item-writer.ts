import IDataItem from "../models/IDataItem";
import StringBuilder from "../models/string-builder";
import ProcedureWriter from "./procedure-writer";

export default class DataItemWriter {
  static write(dataItem: IDataItem, indentation: number): string {
    return new StringBuilder()
      .write(dataItem.header, indentation)
      .append(dataItem.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(dataItem, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(dataItem: IDataItem, indentation: number): string {
    return new StringBuilder()
      .write(dataItem.properties, indentation)
      .emptyLine()
      .writeEach(dataItem.dataItems, (dataItem) =>
        DataItemWriter.write(dataItem, indentation)
      )
      .emptyLine()
      .writeEach(dataItem.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
