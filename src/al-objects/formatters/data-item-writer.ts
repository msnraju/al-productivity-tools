import IDataItem from "../components/models/data-item.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";

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
        MethodDeclarationWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
