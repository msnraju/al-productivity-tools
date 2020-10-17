import { Helper } from "../helper";
import { IFunctionHeader } from "../models/IFunctionHeader";
import { IParameter } from "../models/IParameter";
import { IReadContext } from "../models/IReadContext";
import { IVariable } from "../models/IVariable";
import { VariableReader } from "./variable-reader";

export class FunctionHeaderReader {
  static read(context: IReadContext): IFunctionHeader {
    const header = this.getFunctionHeaderInstance();

    this.readFunctionScope(context, header);

    Helper.readWhiteSpaces(context, []);
    header.type = this.getFunctionType(context);
    Helper.readWhiteSpaces(context, []);
    this.readFunctionName(context, header);

    header.parameters = this.readParameters(context);
    Helper.readWhiteSpaces(context, []);

    header.returnType = this.readReturnType(context);

    let value = context.tokens[context.pos].value.toLowerCase();
    if (value === ";") {
      context.pos++;
      Helper.readWhiteSpaces(context, []);
    }

    return header;
  }

  private static getFunctionHeaderInstance(): IFunctionHeader {
    return {
      local: false,
      internal: false,
      name: "",
      variable: "",
      event: false,
      type: "",
      parameters: [],
      returnType: undefined,
    };
  }

  private static readFunctionName(
    context: IReadContext,
    header: IFunctionHeader
  ) {
    header.name = context.tokens[context.pos].value;
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== "::") return;

    header.event = true;
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    header.variable = header.name;
    header.name = context.tokens[context.pos].value;
    context.pos++;
    Helper.readWhiteSpaces(context, []);
  }

  private static readFunctionScope(
    context: IReadContext,
    header: IFunctionHeader
  ) {
    let value = context.tokens[context.pos].value.toLowerCase();

    if (
      value !== "local" &&
      value !== "internal" &&
      value !== "procedure" &&
      value !== "trigger"
    ) {
      throw new Error("Invalid function name");
    }

    if (value === "internal") {
      header.internal = true;
      value = context.tokens[++context.pos].value.toLowerCase();
    }

    if (value === "local") {
      header.local = true;
      value = context.tokens[++context.pos].value.toLowerCase();
    }
    return value;
  }

  private static getFunctionType(context: IReadContext) {
    let type = context.tokens[context.pos].value.toLowerCase();

    if (type !== "trigger" && type !== "procedure") {
        throw new Error(`Invalid type '${type}'.`);
    }

    context.pos++;
    return type;
  }

  private static readReturnType(context: IReadContext): IVariable | undefined {
    let returnType: IVariable | undefined;
    let value = context.tokens[context.pos].value.toLowerCase();

    if (value !== "begin" && value !== "var" && value !== ";") {
      returnType = VariableReader.read(context, true, context.pos);
    }

    return returnType;
  }

  private static readParameters(context: IReadContext) {
    const parameters: Array<IParameter> = [];

    let value = context.tokens[context.pos].value;
    if (value !== "(") {
        throw new Error(`Syntax error at function declaration, '(' expected.`);
    }
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLowerCase();
    while (value !== ")") {
      let resetIndex = context.pos;

      let ref = false;
      if (value === "var") {
        ref = true;
        context.pos++;
        Helper.readWhiteSpaces(context, []);
      }

      const variable = VariableReader.read(context, false, resetIndex);
      if (!variable) {
        throw new Error("Syntax error at function parameters.");
      }

      if (ref) variable.value = "var " + variable.value;

      parameters.push({
        ref: ref,
        ...variable,
      });

      value = context.tokens[context.pos].value.toLowerCase();
    }

    if (value !== ")") {
        throw new Error(`Syntax error at function declaration, ')' expected.`);
    }

    context.pos++;
    return parameters;
  }
}
