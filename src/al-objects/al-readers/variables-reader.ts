import { Helper } from "../helper";
import { Keywords } from "../keywords";
import { IReadContext } from "../models/IReadContext";
import { IVariable } from "../models/IVariable";
import { VariableReader } from "./variable-reader";

export class VariablesReader {
  static read(context: IReadContext): Array<IVariable> {
    if (!this.hasVariables(context)) {
      return [];
    }

    Helper.readWhiteSpaces(context, []);
    const variables = this.readVariables(context);
    Helper.readWhiteSpaces(context, []);
    return variables;
  }

  private static hasVariables(context: IReadContext) {
    let value = context.tokens[context.pos].value;
    if (value.toLowerCase() === "var") {
      context.pos++;
      return true;
    }

    return false;
  }

  private static readVariables(context: IReadContext): IVariable[] {
    const variables: IVariable[] = [];
    let preBuffer: Array<string> = [];
    let resetIndex = context.pos;

    while (context.pos + 3 < context.tokens.length) {
      // Comments
      if (context.tokens[context.pos].type === "comment") {
        preBuffer.push(...Helper.readComments(context));
        continue;
      }

      // Attributes
      const attribute = Helper.readAttribute(context, Keywords.Variables);
      if (attribute.length > 0) {
        preBuffer.push(attribute);
        continue;
      }

      const variable = VariableReader.read(context, false, resetIndex);
      if (!variable) {
        context.pos = resetIndex;
        return variables;
      }

      variable.preVariable = preBuffer;
      variables.push(variable);

      preBuffer = [];
      resetIndex = context.pos;
    }

    return variables;
  }
}
