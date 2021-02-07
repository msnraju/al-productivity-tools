import _ = require("lodash");
import IVarSection from "../components/models/var-section.model";
import StringBuilder from "../../helpers/string-builder";
import VariableWriter from "./variable-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class VarSectionWriter {
  static write(
    variables: IVarSection,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    if (!variables || variables.variables.length === 0) {
      return "";
    }

    const variables2 = formatSetting.sortVariables
      ? _.sortBy(variables.variables, (item) => item.weight)
      : variables.variables;

    const header = variables.protected ? "protected var" : "var";
    return new StringBuilder()
      .write(header, indentation)
      .writeEach(variables2, (variable) =>
        VariableWriter.write(variable, indentation + 4)
      )
      .toString();
  }
}
