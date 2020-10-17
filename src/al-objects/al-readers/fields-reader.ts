import { IReadContext } from "../models/IReadContext";
import { Helper } from "../helper";
import { IFieldsContainer } from "../models/IFieldsContainer";
import { FieldReader } from "./field-reader";

export class FieldsReader {
  static read(context: IReadContext): IFieldsContainer {
    const container: IFieldsContainer = this.getContainerInstance();

    this.readFieldsDeclaration(context);
    Helper.readWhiteSpaces(context, []);
    container.postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    this.readFieldsBody(context, container);
    Helper.readWhiteSpaces(context, []);

    return container;
  }

  private static getContainerInstance(): IFieldsContainer {
    return {
      fields: [],
      postLabelComments: [],
      comments: [],
    };
  }

  private static readFieldsBody(context: IReadContext, container: IFieldsContainer) {
    let value = context.tokens[context.pos].value;
    if (value !== "{") {
      throw new Error(`Syntax error at Fields declaration, '{' expected.`);
    }

    context.pos++;

    container.comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (value === "field" || value === "modify") {
      container.fields.push(FieldReader.read(context));
      value = context.tokens[context.pos].value.toLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== "}") {
      throw new Error(`Syntax error at Fields declaration, '}' expected.`);
    }

    context.pos++;
  }

  private static readFieldsDeclaration(context: IReadContext) {
    let name = context.tokens[context.pos].value.toLowerCase();
    if (name !== "fields") {
      throw new Error(`Invalid fields label '${name}'.`);
    }

    context.pos++;
    return name;
  }
}