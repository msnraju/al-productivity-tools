import ITokenReader from "../../tokenizers/models/token-reader.model";
import PropertyReader from "./property-reader";
import IFieldGroup from "../components/models/field-group.model";
import FieldGroup from "../components/field-group";
import IToken from "../../tokenizers/models/token.model";
import ICodeIndex from "../models/code-index.model";

export default class FieldGroupReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): IFieldGroup {
    const fieldGroup: IFieldGroup = new FieldGroup();

    fieldGroup.keyword = this.getLabel(tokenReader);
    fieldGroup.declaration = this.getDeclaration(tokenReader);
    fieldGroup.comments = tokenReader.readComments();
    this.readBody(tokenReader, fieldGroup, codeIndex);

    return fieldGroup;
  }

  private static readBody(
    tokenReader: ITokenReader,
    fieldGroup: IFieldGroup,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test(
      "{",
      "Syntax error at FieldGroup declaration, '{' expected."
    );

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      if (tokenReader.tokenType() === "comment") {
        const comments = tokenReader.readComments();
        comments.forEach(p => fieldGroup.properties.push({ name: '//', property: p }))
      } else {
        fieldGroup.properties.push(PropertyReader.read(tokenReader, codeIndex));
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test(
      "}",
      "Syntax error at FieldGroup declaration, '}' expected."
    );
  }

  private static getDeclaration(tokenReader: ITokenReader): IToken[] {
    tokenReader.test(
      "(",
      "Syntax error at FieldGroup declaration, '(' expected."
    );

    const tokens: IToken[] = [];
    while (tokenReader.peekTokenValue() !== ")") {
      tokens.push(tokenReader.token());
    }

    tokenReader.test(
      ")",
      "Syntax error at FieldGroup declaration, ')' expected."
    );

    return tokens;
  }

  private static getLabel(tokenReader: ITokenReader) {
    let label = tokenReader.tokenValue().toLowerCase();
    if (label !== "fieldgroup") {
      throw new Error(`Invalid FieldGroup label '${label}'.`);
    }

    tokenReader.readWhiteSpaces();

    return label;
  }
}
