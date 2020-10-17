import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IDataItem } from "../models/IDataItem";

export class DataItemReader {
  static read(context: IReadContext): IDataItem {
    const dataItem: IDataItem = this.getDataItemInstance();

    dataItem.header = this.readDataItemHeader(context);

    Helper.readWhiteSpaces(context, []);
    dataItem.comments = Helper.readComments(context);

    this.readDataItemItems(context, dataItem);

    Helper.readWhiteSpaces(context, []);
    return dataItem;
  }

  private static readDataItemItems(context: IReadContext, dataItem: IDataItem) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at DateItem declaration, '{' expected.`);
    }

    context.pos++;

    let comments: Array<string> = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "dataitem":
        case "column":
          dataItem.dataItems.push(this.read(context));
          break;
        case "trigger":
          dataItem.triggers.push(FunctionReader.read(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            dataItem.properties.push(...comments);
            comments = [];
            dataItem.properties.push(PropertyReader.read(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLowerCase();
    }

    if (value !== "}") {
      throw new Error(`Syntax error at DateItem declaration, '}' expected.`);
    }

    context.pos++;
  }

  private static readDataItemHeader(context: IReadContext) {
    const name = this.getDataItemType(context);
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
      throw new Error(`Syntax error at DateItem declaration, '(' expected.`);
    }

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

    if (value !== ")") {
      throw new Error(`Syntax error at DateItem declaration, ')' expected.`);
    }

    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    return `${name}${Helper.tokensToString(headerTokens, {})}`;
  }

  private static getDataItemType(context: IReadContext) {
    const name = context.tokens[context.pos].value.toLowerCase();
    if (Keywords.ReportDataItemTypes.indexOf(name) === -1) {
      throw new Error(`Invalid DataItem type '${name}'.`);
    }

    context.pos++;
    return name;
  }

  private static getDataItemInstance(): IDataItem {
    return {
      header: "",
      dataItems: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };
  }
}
