import IDataItem from "../components/models/data-item.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class DataItemWriter {
  static write(
    dataItem: IDataItem,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(dataItem.header, indentation)
      .append(dataItem.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(dataItem, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    dataItem: IDataItem,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(dataItem.properties, indentation)
      .emptyLine()
      .writeEach(dataItem.dataItems, (dataItem) =>
        DataItemWriter.write(dataItem, formatSetting, indentation)
      )
      .emptyLine()
      .writeEach(dataItem.triggers, (trigger) =>
        MethodDeclarationWriter.write(trigger, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
