import { IReadContext, ISegment } from "./object-reader";
import { IToken } from "./tokenizer";
import { Helper } from "./helper";
import { FunctionReader, IFunction } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "./keywords";
import _ = require("lodash");

export interface IDataSet {
  dataItems: Array<IDataItem>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}

export interface IDataItem {
  dataItems: Array<IDataItem>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}

export class DataSetReader {
  static readDataSet(context: IReadContext): IDataSet {
    const dataItems: Array<IDataItem> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== "dataset") throw new Error("Invalid dataset position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid dataset position");
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (Keywords.ReportDataItemTypes.indexOf(value) !== -1) {
      const dataItem = this.readDataItem(context);
      dataItems.push(dataItem);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") throw new Error("Invalid dataset position");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      dataItems: dataItems,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readDataItem(context: IReadContext): IDataItem {
    const dataItem: IDataItem = {
      header: "",
      dataItems: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (Keywords.ReportDataItemTypes.indexOf(name) === -1)
      throw Error("Invalid data item position");

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") throw Error("Invalid data item position");
    let counter = 1;
    const headerTokens: Array<IToken> = [];
    while (value !== ")" || counter !== 0) {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    if (value !== ")") throw Error("Invalid data item position");
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    dataItem.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    dataItem.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== "{") throw new Error("Invalid data item position");
    context.pos++;

    let comments: Array<string> = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== "}") {
      switch (value) {
        case "dataitem":
        case "column":
          dataItem.dataItems.push(this.readDataItem(context));
          break;
        case "trigger":
          dataItem.triggers.push(
            FunctionReader.readFunction(context, comments)
          );
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            comments.forEach((comment) => dataItem.properties.push(comment));
            comments = [];
            dataItem.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== "}") throw new Error("Invalid data item position");
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return dataItem;
  }

  static dataSetToString(dataset: IDataSet): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart("", 4);

    lines.push(`${pad}dataset`);
    if (dataset.postLabelComments.length > 0) {
      dataset.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (dataset.comments.length > 0) {
      dataset.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    dataset.dataItems.forEach((dataItem) => {
      const dataItemLines = this.dataItemToString(dataItem, 8);
      dataItemLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static dataItemToString(
    dataItem: IDataItem,
    indentation: number
  ): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart("", indentation);
    const pad12 = _.padStart("", indentation + 4);
    lines.push(`${pad}${dataItem.header}`);
    dataItem.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (dataItem.properties.length > 0) {
      dataItem.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push("");
    }

    if (dataItem.dataItems.length > 0) {
      dataItem.dataItems.forEach((control2) => {
        const controlLines = this.dataItemToString(control2, indentation + 4);
        controlLines.forEach((line) => lines.push(line));
      });
    }

    if (dataItem.triggers.length > 0) {
      dataItem.triggers.forEach((trigger) => {
        const triggerLines = FunctionReader.functionToString(
          trigger,
          indentation + 4
        );
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
