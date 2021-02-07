import IDataSet from "../components/models/data-set.model";
import DataItemWriter from "./data-item-writer";
import StringBuilder from "../../helpers/string-builder";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class DataSetWriter {
  static write(
    dataset: IDataSet,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write("dataset", indentation)
      .write(dataset.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(dataset, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    dataset: IDataSet,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(dataset.comments, indentation)
      .writeEach(dataset.dataItems, (dataItem) =>
        DataItemWriter.write(dataItem, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
