import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IVariable } from "../models/IVariable";
import { IProcedureDeclaration } from "../models/IProcedureDeclaration";
import { IAttributeType } from "../models/IAttributeType";
import { IProcedure } from "../models/IProcedure";
import { VariablesReader } from "./variables-reader";
import { ProcedureDeclarationReader } from "./procedure-declaration-reader";
import Procedure from "../dto/procedure";
import AttributeReader from "./attribute-reader";

export class ProcedureReader {
  static read(tokenReader: ITokenReader, comments: string[]): IProcedure {
    const procedure = new Procedure(comments);

    const attributeType: IAttributeType = {
      integrationEvent: false,
      businessEvent: false,
      eventSubscriber: false,
    };

    procedure.preFunction = this.readAttributesAndComments(
      tokenReader,
      attributeType
    );

    procedure.header = ProcedureDeclarationReader.read(tokenReader);
    if (attributeType.eventSubscriber) procedure.header.local = true;

    procedure.preVariableComments = tokenReader.readComments();
    procedure.variables = this.readVariables(tokenReader);
    procedure.postVariableComments = tokenReader.readComments();
    procedure.body = this.readFunctionBody(tokenReader);
    procedure.weight = this.getWeight(procedure.header, attributeType);

    return procedure;
  }

  private static readVariables(tokenReader: ITokenReader) {
    let variables: Array<IVariable> = [];

    let value = tokenReader.peekTokenValue().toLowerCase();
    if (value === "var") {
      variables = VariablesReader.read(tokenReader);
    }

    return variables;
  }

  private static readFunctionBody(tokenReader: ITokenReader) {
    const tokens: IToken[] = [];

    let value = tokenReader.peekTokenValue().toLowerCase();
    if (value !== "begin") {
      throw new Error("read function, begin expected");
    }

    let counter = 1;
    while (value !== "end" || counter !== 0) {
      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue().toLowerCase();

      if (value === "begin" || value === "case") {
        counter++;
      } else if (value === "end") {
        counter--;
      }
    }

    if (value !== "end" || counter !== 0) {
      throw new Error("trigger end error.");
    }

    tokens.push(tokenReader.token());

    value = tokenReader.peekTokenValue();
    if (value !== ";") {
      throw new Error(`trigger end error.`);
    }

    tokens.push(tokenReader.token());

    tokenReader.readWhiteSpaces();
    return Helper.tokensToString(tokens, Keywords.Symbols);
  }

  private static readAttributesAndComments(
    tokenReader: ITokenReader,
    attributeType: IAttributeType
  ): string[] {
    const lines: string[] = [];
    attributeType.integrationEvent = false;
    attributeType.businessEvent = false;
    attributeType.eventSubscriber = false;

    let token = tokenReader.peekToken();
    while (token.value === "[" || token.type === "comment") {
      if (token.value === "[") {
        const attribute = AttributeReader.read(tokenReader, Keywords.Variables);
        if (attribute.toLowerCase().indexOf("integrationevent") !== -1) {
          attributeType.integrationEvent = true;
        }

        if (attribute.toLowerCase().indexOf("businessevent") !== -1) {
          attributeType.businessEvent = true;
        }

        if (attribute.toLowerCase().indexOf("subscriber") !== -1) {
          attributeType.eventSubscriber = true;
        }

        lines.push(attribute);
      } else if (token.type === "comment") {
        lines.push(...tokenReader.readComments());
      }

      tokenReader.readWhiteSpaces();
      token = tokenReader.peekToken();
    }

    tokenReader.readWhiteSpaces();
    return lines;
  }

  private static getWeight(
    header: IProcedureDeclaration,
    attributeType: IAttributeType
  ): number {
    let weight = 0;

    if (
      header.local === false &&
      header.internal === false &&
      attributeType.integrationEvent == false &&
      attributeType.businessEvent === false &&
      attributeType.eventSubscriber === false
    ) {
      // global
      weight = 0;
    } else if (attributeType.eventSubscriber) {
      // event subscriber
      weight = 100;
      header.local = true;
    } else if (
      header.internal &&
      attributeType.integrationEvent === false &&
      attributeType.businessEvent === false
    ) {
      // internal
      weight = 150;
    } else if (
      header.local &&
      attributeType.integrationEvent === false &&
      attributeType.businessEvent === false
    ) {
      // local
      weight = 200;
    } else if (attributeType.integrationEvent) {
      // integration event
      weight = 250;
    } else if (attributeType.businessEvent) {
      // business event
      weight = 300;
    } else {
      weight = 400;
    }

    return weight;
  }
}
