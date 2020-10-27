import ITokenReader from "../models/ITokenReader";
import IFieldsContainer from "../models/IFieldsContainer";
import FieldReader from "./field-reader";
import FieldsContainer from "../dto/fields-container";

export default class FieldsReader {
  static read(tokenReader: ITokenReader): IFieldsContainer {
    const container: IFieldsContainer = new FieldsContainer();

    this.readDeclaration(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IFieldsContainer
  ) {
    tokenReader.test("{", "Syntax error at Fields declaration, '{' expected.");

    container.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value === "field" || value === "modify") {
      container.fields.push(FieldReader.read(tokenReader));
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at Fields declaration, '}' expected.");
  }

  private static readDeclaration(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "fields") {
      throw new Error(`Invalid fields label '${name}'.`);
    }

    tokenReader.readWhiteSpaces();
    return name;
  }
}
