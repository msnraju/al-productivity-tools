import { IReadContext } from "../models/IReadContext";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IDataSet } from "../models/IDataSet";
import { IDataItem } from "../models/IDataItem";
import { DataItemReader } from "./data-item-reader";

export class DataSetReader {
  static read(context: IReadContext): IDataSet {
    const dataSet: IDataSet = this.getDataSetInstance();
    this.readHeader(context);

    Helper.readWhiteSpaces(context, []);
    dataSet.postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    this.readDataSetItems(context, dataSet);
    Helper.readWhiteSpaces(context, []);

    return dataSet;
  }

  private static getDataSetInstance(): IDataSet {
    return {
      dataItems: [],
      postLabelComments: [],
      comments: [],
    };
  }

  private static readDataSetItems(context: IReadContext, dataSet: IDataSet) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at DataSet declaration, '{' expected.`);
    }
    context.pos++;

    dataSet.comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (Keywords.ReportDataItemTypes.indexOf(value) !== -1) {
      const dataItem = DataItemReader.read(context);
      dataSet.dataItems.push(dataItem);
      value = context.tokens[context.pos].value.toLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") {
      throw new Error(`Syntax error at DataSet declaration, '}' expected.`);
    }
    context.pos++;
  }

  private static readHeader(context: IReadContext) {
    const value = context.tokens[context.pos].value.toLowerCase();
    if (value !== "dataset") {
      throw new Error("Invalid DataSet declaration.");
    }

    context.pos++;
  }
}
