import ITokenReader from "../../tokenizers/models/token-reader.model";
import MethodDeclarationReader from "./method-declaration-reader";
import PropertyReader from "./property-reader";
import IField from "../components/models/field.model";
import Field from "../components/field";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";

export default class FieldReader {
  static read(tokenReader: ITokenReader): IField {
    const field: IField = new Field();

    field.header = this.readHeader(tokenReader);
    field.comments = tokenReader.readComments();
    this.readBody(tokenReader, field);
    tokenReader.readWhiteSpaces();

    return field;
  }

  private static readBody(tokenReader: ITokenReader, field: IField) {
    tokenReader.test("{", "Syntax error at Field declaration, '{' expected.");

    let comments: string[] = [];

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "trigger":
          field.triggers.push(MethodDeclarationReader.read(tokenReader, comments));
          comments = [];
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            field.properties.push(...comments);
            comments = [];
            field.properties.push(PropertyReader.read(tokenReader));
          }
      }

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at Field declaration, '}' expected.");
  }

  private static readHeader(tokenReader: ITokenReader): string {
    let name = FieldReader.getFieldType(tokenReader);

    tokenReader.test("(", "Syntax error at Field declaration, '(' expected.");

    const tokens: IToken[] = [];
    while (tokenReader.peekTokenValue() !== ")") {
      tokens.push(tokenReader.token());
    }

    tokenReader.test(")", "Syntax error at Field declaration, ')' expected.");

    return `${name}(${TokenReader.tokensToString(tokens, {})})`;
  }

  private static getFieldType(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "field" && name !== "modify") {
      throw new Error(`Invalid field type '${name}'.`);
    }

    tokenReader.readWhiteSpaces();

    return name;
  }
}
