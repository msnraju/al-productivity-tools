import ITokenReader from "../models/ITokenReader";
import IFieldGroupList from "../components/models/field-group-list.model";
import FieldGroupReader from "./field-group-reader";
import FieldGroupContainer from "../components/field-group-container";

export default class FieldGroupsReader {
  static read(tokenReader: ITokenReader): IFieldGroupList {
    const container: IFieldGroupList = new FieldGroupContainer();

    container.keyword = this.getLabel(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IFieldGroupList
  ) {
    tokenReader.test(
      "{",
      "Syntax error at FieldGroups declaration, '{' expected."
    );

    container.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value === "fieldgroup") {
      container.fieldGroups.push(FieldGroupReader.read(tokenReader));
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test(
      "}",
      "Syntax error at FieldGroups declaration, '}' expected."
    );
  }

  private static getLabel(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "fieldgroups") {
      throw new Error(`Invalid FieldGroups label '${name}'.`);
    }

    tokenReader.readWhiteSpaces();
    return name;
  }
}
