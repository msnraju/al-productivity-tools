import _ = require("lodash");
import IVarSection from "../components/models/var-section.model";
import StringBuilder from "../../helpers/string-builder";
import VariableWriter from "./variable-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";
import IMethodDeclaration from "../components/models/method-declaration.model";
import IVariable from "../models/variable.model";
import ICodeIndex from "../models/code-index.model";

export default class VarSectionWriter {
  static writeGlobalVariables(
    variables: IVarSection,
    formatSetting: IFormatSetting,
    indentation: number,
    codeIndex: ICodeIndex
  ): string {
    if (!variables || variables.variables.length === 0) {
      return "";
    }

    let variablesUsed: IVariable[] = variables.variables;
    if (formatSetting.removeUnusedGlobalVariables) {
      variablesUsed = [];
      variables.variables.forEach((variable) => {
        if (codeIndex.findToken(variable.name)) {
          variablesUsed.push(variable);
        }
      });
    }

    const variables2 = formatSetting.sortVariables
      ? _.sortBy(variablesUsed, (item) => item.weight)
      : variablesUsed;

    const header = variables.protected ? "protected var" : "var";
    return new StringBuilder()
      .write(header, indentation)
      .writeEach(variables2, (variable) =>
        VariableWriter.write(variable, indentation + 4)
      )
      .toString();
  }

  static writeLocalVariables(
    method: IMethodDeclaration,
    variables: IVarSection,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    if (!variables || variables.variables.length === 0) {
      return "";
    }

    let variablesUsed: IVariable[] = variables.variables;
    if (formatSetting.removeUnusedLocalVariables) {
      variablesUsed = [];
      variables.variables.forEach((variable) => {
        if (method.codeIndex.findToken(variable.name)) {
          variablesUsed.push(variable);
        }
      });
    }

    const variables2 = formatSetting.sortVariables
      ? _.sortBy(variablesUsed, (item) => item.weight)
      : variablesUsed;

    const header = variables.protected ? "protected var" : "var";
    return new StringBuilder()
      .write(header, indentation)
      .writeEach(variables2, (variable) =>
        VariableWriter.write(variable, indentation + 4)
      )
      .toString();
  }
}
