import ITokenReader from "../../tokenizers/models/token-reader.model";
import FieldReader from "./field-reader";
import FieldsContainer from "../components/fields-container";
import ICodeIndex from "../models/code-index.model";
import IFieldsContainer from "../components/models/fields-container.model";

export default class FieldsReader {
  static read(
    tokenReader: ITokenReader,
    codeIndex: ICodeIndex
  ): IFieldsContainer {
    const container: IFieldsContainer = new FieldsContainer();

    this.readDeclaration(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container, codeIndex);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IFieldsContainer,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test("{", "Syntax error at Fields declaration, '{' expected.");

    container.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value === "field" || value === "modify") {
      container.fields.push(FieldReader.read(tokenReader, codeIndex));
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
