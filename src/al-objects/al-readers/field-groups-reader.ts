import ITokenReader from "../models/ITokenReader";
import IFieldGroupContainer from "../models/IFieldGroupContainer";
import FieldGroupContainer from "../dto/field-group-container";
import FieldGroupReader from "./field-group-reader";

export default class FieldGroupsReader {
  static read(tokenReader: ITokenReader): IFieldGroupContainer {
    const container: IFieldGroupContainer = new FieldGroupContainer();

    this.readDeclaration(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IFieldGroupContainer
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

  private static readDeclaration(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "fieldgroups") {
      throw new Error(`Invalid FieldGroups label '${name}'.`);
    }

    tokenReader.readWhiteSpaces();
    return name;
  }
}
