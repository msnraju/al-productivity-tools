import { ISegment } from "../models/ISegment";
import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IDataSet } from "../models/IDataSet";
import { IDataItem } from "../models/IDataItem";

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
}
