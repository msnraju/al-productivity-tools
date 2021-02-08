import ITokenReader from "../../tokenizers/models/token-reader.model";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import IDataItem from "../components/models/data-item.model";
import DataItem from "../components/data-item";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import REPORT_DATAITEM_TYPES from "../maps/report-dataitem-types";

export default class DataItemReader {
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
          dataItem.triggers.push(MethodDeclarationReader.read(tokenReader, comments));
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

    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
  }

  private static getDataItemType(tokenReader: ITokenReader) {
    const dataItemType = tokenReader.tokenValue().toLowerCase();
    if (!REPORT_DATAITEM_TYPES.hasItem(dataItemType)) {
      throw new Error(`Invalid DataItem type '${dataItemType}'.`);
    }

    tokenReader.readWhiteSpaces();
    return dataItemType;
  }
}
