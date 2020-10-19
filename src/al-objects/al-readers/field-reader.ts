import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { FunctionReader } from "./function-reader";
import { PropertyReader } from "./property-reader";
import { IField } from "../models/IField";

export class FieldReader {
  static read(context: IReadContext): IField {
    const field: IField = this.getFieldInstance();

    this.readHeader(context, field);

    Helper.readWhiteSpaces(context, []);
    field.comments = Helper.readComments(context);
    this.readFieldBody(context, field);
    Helper.readWhiteSpaces(context, []);
    
    return field;
  }

  private static readFieldBody(context: IReadContext, field: IField) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at Field declaration, '{' expected.`);
    }

    context.pos++;

    let comments: string[] = [];

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    while (value !== "}") {
      switch (value) {
        case "trigger":
          field.triggers.push(FunctionReader.read(context, comments));
          comments = [];
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            field.properties.push(...comments);
            comments = [];
            field.properties.push(PropertyReader.read(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLowerCase();
    }

    if (value !== "}") {
      throw new Error(`Syntax error at Field declaration, '}' expected.`);
    }

    context.pos++;
  }

  private static readHeader(context: IReadContext, field: IField) {
    let name = FieldReader.getFieldType(context);
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
      throw new Error(`Syntax error at Field declaration, '(' expected.`);
    }

    const headerTokens: Array<IToken> = [];
    while (value !== ")") {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
    }

    if (value !== ")") {
      throw new Error(`Syntax error at Field declaration, ')' expected.`);
    }

    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    field.header = `${name}${Helper.tokensToString(headerTokens, {})}`;
    return value;
  }

  private static getFieldType(context: IReadContext) {
    let name = context.tokens[context.pos].value.toLowerCase();
    if (name !== "field" && name !== "modify") {
      throw new Error(`Invalid field type '${name}'.`);
    }

    context.pos++;
    return name;
  }

  private static getFieldInstance(): IField {
    return {
      header: "",
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };
  }
}
