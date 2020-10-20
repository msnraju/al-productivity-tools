import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { ProcedureReader } from "./procedure-reader";
import { PropertyReader } from "./property-reader";
import { Keywords } from "../keywords";
import { IDataItem } from "../models/IDataItem";
import DataItem from "../dto/data-item";

export class DataItemReader {
  static read(tokenReader: ITokenReader): IDataItem {
    const dataItem: IDataItem = new DataItem();

    dataItem.header = this.readDataItemHeader(tokenReader);
    dataItem.comments = tokenReader.readComments();
    this.readDataItemItems(tokenReader, dataItem);

    return dataItem;
  }

  private static readDataItemItems(
    tokenReader: ITokenReader,
    dataItem: IDataItem
  ) {
    tokenReader.test(
      "{",
      "Syntax error in DateItem declaration, '{' expected."
    );

    let comments: Array<string> = [];

    tokenReader.readWhiteSpaces();
    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "dataitem":
        case "column":
          dataItem.dataItems.push(this.read(tokenReader));
          break;
        case "trigger":
          dataItem.triggers.push(ProcedureReader.read(tokenReader, comments));
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            dataItem.properties.push(...comments);
            comments = [];
            dataItem.properties.push(PropertyReader.read(tokenReader));
          }
          break;
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test(
      "}",
      "Syntax error in DateItem declaration, '}' expected."
    );
  }

  private static readDataItemHeader(tokenReader: ITokenReader) {
    const name = this.getDataItemType(tokenReader);

    tokenReader.test(
      "(",
      "Syntax error in DateItem declaration, '(' expected."
    );

    const tokens: IToken[] = [];
    let counter = 1;
    let value = tokenReader.peekTokenValue();

    while (value !== ")" || counter !== 0) {
      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue();

      if (value === "(") {
        counter++;
      } else if (value === ")") {
        counter--;
      }
    }

    tokenReader.test(
      ")",
      "Syntax error in DateItem declaration, ')' expected."
    );

    return `${name}(${Helper.tokensToString(tokens, {})})`;
  }

  private static getDataItemType(tokenReader: ITokenReader) {
    const name = tokenReader.tokenValue().toLowerCase();
    if (Keywords.ReportDataItemTypes.indexOf(name) === -1) {
      throw new Error(`Invalid DataItem type '${name}'.`);
    }

    tokenReader.readWhiteSpaces();
    return name;
  }
}
