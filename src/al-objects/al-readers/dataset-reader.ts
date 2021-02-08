import ITokenReader from "../../tokenizers/models/token-reader.model";
import IDataSet from "../components/models/data-set.model";
import DataItemReader from "./data-item-reader";
import DataSet from "../components/data-set";
import REPORT_DATAITEM_TYPES from "../maps/report-dataitem-types";

export default class DataSetReader {
  static read(tokenReader: ITokenReader): IDataSet {
    const dataSet: IDataSet = new DataSet();
    this.readHeader(tokenReader);
    dataSet.postLabelComments = tokenReader.readComments();
    this.readDataSetItems(tokenReader, dataSet);

    return dataSet;
  }

  private static readDataSetItems(
    tokenReader: ITokenReader,
    dataSet: IDataSet
  ) {
    tokenReader.test("{", "Syntax error at DataSet declaration, '{' expected.");

    dataSet.comments = tokenReader.readComments();

    let dataItemType = tokenReader.peekTokenValue().toLowerCase();
    while (REPORT_DATAITEM_TYPES.hasItem(dataItemType)) {
      dataSet.dataItems.push(DataItemReader.read(tokenReader));
      dataItemType = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at DataSet declaration, '}' expected.");
  }

  private static readHeader(tokenReader: ITokenReader) {
    const label = tokenReader.tokenValue().toLowerCase();
    if (label !== "dataset") {
      throw new Error("Invalid DataSet declaration.");
    }

    tokenReader.readWhiteSpaces();
  }
}
