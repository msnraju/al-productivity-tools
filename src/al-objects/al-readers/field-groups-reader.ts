import ITokenReader from "../../tokenizers/models/token-reader.model";
import IFieldGroupList from "../components/models/field-group-list.model";
import FieldGroupReader from "./field-group-reader";
import FieldGroupContainer from "../components/field-group-container";
import ICodeIndex from "../models/code-index.model";

export default class FieldGroupsReader {
  static read(
    tokenReader: ITokenReader,
    codeIndex: ICodeIndex
  ): IFieldGroupList {
    const container: IFieldGroupList = new FieldGroupContainer();

    container.keyword = this.getLabel(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container, codeIndex);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IFieldGroupList,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test(
      "{",
      "Syntax error at FieldGroups declaration, '{' expected."
    );

    container.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value === "fieldgroup") {
      container.fieldGroups.push(FieldGroupReader.read(tokenReader, codeIndex));
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
