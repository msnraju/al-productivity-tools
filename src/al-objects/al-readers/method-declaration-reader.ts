import SYMBOLS from "../maps/symbols-map";
import ITokenReader from "../../tokenizers/models/token-reader.model";
import IAttributeType from "../components/models/attribute-type.model";
import IMethodDeclaration from "../components/models/method-declaration.model";
import VarSectionReader from "./var-section-reader";
import AttributeReader from "./attribute-reader";
import MethodDeclaration from "../components/method-declaration";
import IVarSection from "../components/models/var-section.model";
import IVariable from "../models/IVariable";
import VariableReader from "./variable-reader";
import IParameter from "../components/models/parameter.model";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";

export default class MethodDeclarationReader {
  static read(
    tokenReader: ITokenReader,
    comments: string[]
  ): IMethodDeclaration {
    const method: IMethodDeclaration = new MethodDeclaration(comments);

    const attributeType: IAttributeType = {
      integrationEvent: false,
      businessEvent: false,
      eventSubscriber: false,
    };

    method.attributes = this.readAttributesAndComments(
      tokenReader,
      attributeType
    );

    this.readMethodScope(tokenReader, method);
    method.type = this.getMethodType(tokenReader);
    method.name = this.readMethodName(tokenReader);
    method.parameterList = this.readParameters(tokenReader);
    method.returnType = this.readReturnType(tokenReader);

    this.readSemicolon(tokenReader);
    if (attributeType.eventSubscriber) {
      method.local = true;
    }

    method.preVarSectionComments = tokenReader.readComments();
    method.variables = this.readVariables(tokenReader);
    method.postVarSectionComments = tokenReader.readComments();
    method.body = this.readFunctionBody(tokenReader);
    method.weight = this.getWeight(method, attributeType);

    return method;
  }

  private static readSemicolon(tokenReader: ITokenReader) {
    let value = tokenReader.peekTokenValue().toLowerCase();
    if (value === ";") {
      tokenReader.next();
    }

    tokenReader.readWhiteSpaces();
  }

  private static readMethodName(tokenReader: ITokenReader): string {
    let name = tokenReader.tokenValue();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue();
    if (value !== "::") {
      return name;
    }

    tokenReader.next();
    tokenReader.readWhiteSpaces();

    name = `${name}::${tokenReader.tokenValue()}`;
    tokenReader.readWhiteSpaces();

    return name;
  }

  private static readMethodScope(
    tokenReader: ITokenReader,
    method: IMethodDeclaration
  ) {
    let value = tokenReader.peekTokenValue().toLowerCase();

    if (
      value !== "local" &&
      value !== "internal" &&
      value !== "procedure" &&
      value !== "trigger"
    ) {
      throw new Error("Invalid function name");
    }

    if (value === "internal") {
      method.internal = true;
      tokenReader.next();
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    if (value === "local") {
      method.local = true;
      tokenReader.next();
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.readWhiteSpaces();
  }

  private static getMethodType(tokenReader: ITokenReader) {
    let type = tokenReader.tokenValue().toLowerCase();

    if (type !== "trigger" && type !== "procedure") {
      throw new Error(`Invalid type '${type}'.`);
    }

    tokenReader.readWhiteSpaces();

    return type;
  }

  private static readReturnType(
    tokenReader: ITokenReader
  ): IVariable | undefined {
    let returnType: IVariable | undefined;
    let value = tokenReader.peekTokenValue().toLowerCase();

    if (value !== "begin" && value !== "var" && value !== ";") {
      returnType = VariableReader.read(tokenReader, true, tokenReader.pos);
    }

    return returnType;
  }

  private static readParameters(tokenReader: ITokenReader) {
    const parameters: Array<IParameter> = [];

    tokenReader.test(
      "(",
      "Syntax error at function declaration, '(' expected."
    );

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value !== ")") {
      let resetIndex = tokenReader.pos;
      let ref = false;

      if (value === "var") {
        ref = true;
        tokenReader.next();
        tokenReader.readWhiteSpaces();
      }

      const variable = VariableReader.read(tokenReader, false, resetIndex);
      if (!variable) {
        throw new Error("Syntax error at function parameters.");
      }

      if (ref) variable.value = "var " + variable.value;

      parameters.push({
        ref: ref,
        ...variable,
      });

      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test(
      ")",
      "Syntax error at function declaration, ')' expected."
    );

    return parameters;
  }

  private static readVariables(
    tokenReader: ITokenReader
  ): IVarSection | undefined {
    let value = tokenReader.peekTokenValue().toLowerCase();
    if (value === "var") {
      return VarSectionReader.read(tokenReader);
    }
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
    return TokenReader.tokensToString(tokens, SYMBOLS);
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
        const attribute = AttributeReader.read(tokenReader);
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
    method: IMethodDeclaration,
    attributeType: IAttributeType
  ): number {
    let weight = 0;

    if (
      method.local === false &&
      method.internal === false &&
      attributeType.integrationEvent == false &&
      attributeType.businessEvent === false &&
      attributeType.eventSubscriber === false
    ) {
      // global
      weight = 0;
    } else if (attributeType.eventSubscriber) {
      // event subscriber
      weight = 100;
      method.local = true;
    } else if (
      method.internal &&
      attributeType.integrationEvent === false &&
      attributeType.businessEvent === false
    ) {
      // internal
      weight = 150;
    } else if (
      method.local &&
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
