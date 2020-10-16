import { IReadContext } from "../models/IReadContext";
import { IToken } from "../tokenizer";
import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { VariableReader } from "./variable-reader";
import { IVariable } from "../models/IVariable";
import { IFunctionHeader } from "../models/IFunctionHeader";
import { IAttributeType } from "../models/IAttributeType";
import { IParameter } from "../models/IParameter";
import { IFunction } from "../models/IFunction";

export class FunctionReader {
  static readAttributesAndComments(
    context: IReadContext,
    attributeType: IAttributeType
  ): Array<string> {
    const lines: Array<string> = [];
    attributeType.integrationEvent = false;
    attributeType.businessEvent = false;
    attributeType.eventSubscriber = false;

    let token = context.tokens[context.pos];
    while (token.value === "[" || token.type === "comment") {
      if (token.value === "[") {
        const attribute = Helper.readAttribute(context, Keywords.Variables);
        if (attribute.toLocaleLowerCase().indexOf("integrationevent") !== -1) {
          attributeType.integrationEvent = true;
        }

        if (attribute.toLocaleLowerCase().indexOf("businessevent") !== -1) {
          attributeType.businessEvent = true;
        }

        if (attribute.toLocaleLowerCase().indexOf("subscriber") !== -1) {
          attributeType.eventSubscriber = true;
        }

        lines.push(attribute);
        token = context.tokens[context.pos];
        continue;
      }

      if (token.type === "comment") {
        lines.push(token.value);
        Helper.readWhiteSpaces(context, []);
        token = context.tokens[context.pos];
        continue;
      }

      token = context.tokens[++context.pos];
    }

    return lines;
  }

  static readHeader(context: IReadContext): IFunctionHeader {
    const parameters: Array<IParameter> = [];
    let returnType: IVariable | undefined = undefined;
    let value = context.tokens[context.pos].value.toLocaleLowerCase();

    if (
      value !== "local" &&
      value !== "internal" &&
      value !== "procedure" &&
      value !== "trigger"
    )
      throw new Error("Invalid function name");

    let local = false;
    let internal = false;
    let event = false;

    if (value === "internal") {
      internal = true;
      value = context.tokens[++context.pos].value.toLocaleLowerCase();
    }

    if (value === "local") {
      local = true;
      value = context.tokens[++context.pos].value.toLocaleLowerCase();
    }

    Helper.readWhiteSpaces(context, []);
    let functionType = context.tokens[context.pos].value.toLocaleLowerCase();

    if (functionType !== "trigger" && functionType !== "procedure")
      throw new Error("Invalid function name");

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let functionName = context.tokens[context.pos].value;
    let variableName = "";
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value;
    if (value === "::") {
      event = true;
      context.pos++;
      Helper.readWhiteSpaces(context, []);

      variableName = functionName;
      functionName = context.tokens[context.pos].value;
      context.pos++;
      Helper.readWhiteSpaces(context, []);

      value = context.tokens[context.pos].value;
    }

    if (value !== "(") throw new Error("Invalid function name");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== ")") {
      let resetIndex = context.pos;

      let ref = false;
      if (value === "var") {
        ref = true;
        context.pos++;
        Helper.readWhiteSpaces(context, []);
      }

      const variable = VariableReader.readVariable(context, false, resetIndex);
      if (!variable) throw new Error("It should return a variable");
      if (ref) variable.value = "var " + variable.value;

      parameters.push({
        ref: ref,
        ...variable,
      });

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== ")") throw new Error("Invalid function name");
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== "begin" && value !== "var" && value !== ";") {
      returnType = VariableReader.readVariable(context, true, context.pos);
    }

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value === ";") {
      context.pos++;
      Helper.readWhiteSpaces(context, []);
    }

    return {
      local: local,
      internal: internal,
      name: functionName,
      variable: variableName,
      event: event,
      type: functionType,
      parameters: parameters,
      returnType: returnType,
    };
  }

  static readFunction(
    context: IReadContext,
    comments: Array<string>
  ): IFunction {
    const attributeType: IAttributeType = {
      integrationEvent: false,
      businessEvent: false,
      eventSubscriber: false,
    };

    const preFunctionLines = this.readAttributesAndComments(
      context,
      attributeType
    );
    const functionHeader = this.readHeader(context);
    if (attributeType.eventSubscriber) functionHeader.local = true;

    let variables: Array<IVariable> = [];
    const tokens: Array<IToken> = [];

    const preVariableComments = Helper.readComments(context);

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value === "var") {
      variables = VariableReader.readVariables(context);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    const postVariableComments = Helper.readComments(context);

    if (value !== "begin") throw new Error("read function, begin expected");

    let counter = 1;
    while (value !== "end" || counter !== 0) {
      tokens.push(context.tokens[context.pos]);
      value = context.tokens[++context.pos].value.toLocaleLowerCase();
      if (value === "begin" || value === "case") counter++;
      else if (value === "end") counter--;
    }

    if (value !== "end" || counter !== 0) throw new Error("trigger end error.");
    tokens.push(context.tokens[context.pos++]);

    value = context.tokens[context.pos].value;
    if (value !== ";") throw new Error(`trigger end error.`);

    tokens.push(context.tokens[context.pos++]);
    Helper.readWhiteSpaces(context, []);
    const body = Helper.tokensToString(tokens, Keywords.Symbols);

    return {
      preFunctionComments: comments,
      preFunction: preFunctionLines,
      weight: this.getWeight(functionHeader, attributeType),
      header: functionHeader,
      preVariableComments: preVariableComments,
      variables: variables,
      postVariableComments: postVariableComments,
      body: body,
    };
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
