import { ITokenReader } from "../models/ITokenReader";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IVariable } from "../models/IVariable";
import { IFunctionHeader } from "../models/IFunctionHeader";
import { IAttributeType } from "../models/IAttributeType";
import { IFunction } from "../models/IFunction";
import { VariablesReader } from "./variables-reader";
import { FunctionHeaderReader } from "./function-header-reader";

export class FunctionReader {
  static read(tokenReader: ITokenReader, comments: string[]): IFunction {
    const procedure = FunctionReader.getFunctionInstance(comments);

    const attributeType: IAttributeType = {
      integrationEvent: false,
      businessEvent: false,
      eventSubscriber: false,
    };

    procedure.preFunction = this.readAttributesAndComments(
      tokenReader,
      attributeType
    );

    procedure.header = FunctionHeaderReader.read(tokenReader);
    if (attributeType.eventSubscriber) procedure.header.local = true;

    procedure.preVariableComments = tokenReader.readComments();
    procedure.variables = this.readVariables(tokenReader);
    procedure.postVariableComments = tokenReader.readComments();
    procedure.body = this.readFunctionBody(tokenReader);
    procedure.weight = this.getWeight(procedure.header, attributeType);

    return procedure;
  }

  private static getFunctionInstance(comments: string[]): IFunction {
    return {
      preFunctionComments: comments,
      preFunction: [],
      weight: 0,
      header: null,
      preVariableComments: [],
      variables: [],
      postVariableComments: [],
      body: "",
    };
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
    const tokens: Array<IToken> = [];

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
        const attribute = Helper.readAttribute(tokenReader, Keywords.Variables);
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
        token = tokenReader.peekToken();
        continue;
      }

      if (token.type === "comment") {
        lines.push(token.value);
        tokenReader.readWhiteSpaces();
        token = tokenReader.peekToken();
        continue;
      }

      tokenReader.next();
      token = tokenReader.peekToken();
    }

    return lines;
  }

  private static getWeight(
    header: IFunctionHeader,
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
