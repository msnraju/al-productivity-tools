import { REPORT_DATAITEM_TYPES } from "../constants";
import ITokenReader from "../models/ITokenReader";
import IDataSet from "../models/IDataSet";
import DataItemReader from "./data-item-reader";
import DataSet from "../dto/data-set";

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

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (REPORT_DATAITEM_TYPES.indexOf(value) !== -1) {
      dataSet.dataItems.push(DataItemReader.read(tokenReader));
      value = tokenReader.peekTokenValue().toLowerCase();
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
