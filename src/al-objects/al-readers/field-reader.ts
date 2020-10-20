import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { ProcedureReader } from "./procedure-reader";
import { PropertyReader } from "./property-reader";
import { IField } from "../models/IField";
import Field from "../dto/field";

export class FieldReader {
  static read(tokenReader: ITokenReader): IField {
    const field: IField = new Field();

    field.header = this.readHeader(tokenReader);
    field.comments = tokenReader.readComments();
    this.readFieldBody(tokenReader, field);
    tokenReader.readWhiteSpaces();

    return field;
  }

  private static readFieldBody(tokenReader: ITokenReader, field: IField) {
    tokenReader.test("{", "Syntax error at Field declaration, '{' expected.");

    let comments: string[] = [];

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== "}") {
      switch (value) {
        case "trigger":
          field.triggers.push(ProcedureReader.read(tokenReader, comments));
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

    return `${name}(${Helper.tokensToString(tokens, {})})`;
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
