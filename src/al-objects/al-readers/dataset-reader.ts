import ITokenReader from "../../tokenizers/models/token-reader.model";
import IDataSet from "../components/models/data-set.model";
import DataItemReader from "./data-item-reader";
import DataSet from "../components/data-set";
import REPORT_DATAITEM_TYPES from "../maps/report-dataitem-types";
import ICodeIndex from "../models/code-index.model";

export default class DataSetReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): IDataSet {
    const dataSet: IDataSet = new DataSet();
    this.readHeader(tokenReader);
    dataSet.postLabelComments = tokenReader.readComments();
    this.readDataSetItems(tokenReader, dataSet, codeIndex);

    return dataSet;
  }

  private static readDataSetItems(
    tokenReader: ITokenReader,
    dataSet: IDataSet,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test("{", "Syntax error at DataSet declaration, '{' expected.");

    dataSet.comments = tokenReader.readComments();

    let dataItemType = tokenReader.peekTokenValue().toLowerCase();
    while (REPORT_DATAITEM_TYPES.hasItem(dataItemType)) {
      dataSet.dataItems.push(DataItemReader.read(tokenReader, codeIndex));
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
