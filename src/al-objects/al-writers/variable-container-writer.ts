import _ = require("lodash");
import { IVariable } from "../models/IVariable";
import StringBuilder from "../models/string-builder";
import VariableWriter from "./variable-writer";

export class VariableContainerWriter {
  static write(variables: Array<IVariable>, indentation: number): string {
    if (!variables || variables.length === 0) return "";

    variables = _.sortBy(variables, (item) => item.weight);

    return new StringBuilder()
      .write("var", indentation)
      .writeEach(variables, (variable) =>
        VariableWriter.write(variable, indentation + 4)
      )
      .toString();
  }
}
