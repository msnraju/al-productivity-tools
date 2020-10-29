import _ = require("lodash");
import IVarSection from "../components/models/var-section.model";
import StringBuilder from "../models/string-builder";
import VariableWriter from "./variable-writer";

export default class VarSectionWriter {
  static write(variables: IVarSection, indentation: number): string {
    if (!variables || variables.variables.length === 0) {
      return "";
    }

    const variables2 = _.sortBy(variables.variables, (item) => item.weight);

    return new StringBuilder()
      .write("var", indentation)
      .writeEach(variables2, (variable) =>
        VariableWriter.write(variable, indentation + 4)
      )
      .toString();
  }
}