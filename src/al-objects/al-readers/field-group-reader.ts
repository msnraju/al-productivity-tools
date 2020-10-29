import ITokenReader from "../models/ITokenReader";
import IToken from "../models/IToken";
import PropertyReader from "./property-reader";
import IFieldGroup from "../components/models/field-group.model";
import FieldGroup from "../components/field-group";

export default class FieldGroupReader {
  static read(tokenReader: ITokenReader): IFieldGroup {
    const fieldGroup: IFieldGroup = new FieldGroup();

    fieldGroup.keyword = this.getLabel(tokenReader);
    fieldGroup.declaration = this.getDeclaration(tokenReader);
    fieldGroup.comments = tokenReader.readComments();
    this.readBody(tokenReader, fieldGroup);
    
    return fieldGroup;
  }

  private static readBody(tokenReader: ITokenReader, fieldGroup: IFieldGroup) {
    tokenReader.test(
      "{",
      "Syntax error at FieldGroup declaration, '{' expected."
    );

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      if (tokenReader.tokenType() === "comment") {
        fieldGroup.properties.push(...tokenReader.readComments());
      } else {
        fieldGroup.properties.push(PropertyReader.read(tokenReader));
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
