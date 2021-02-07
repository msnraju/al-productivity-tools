import _ = require("lodash");
import IMethodDeclaration from "../components/models/method-declaration.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";

export default class MethodsWriter {
  static write(
    methods: IMethodDeclaration[],
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    if (!methods || methods.length === 0) return "";

    methods = formatSetting.sortProcedures
      ? _.sortBy(methods, (item) => [item.weight])
      : methods;

    return new StringBuilder()
      .writeEach(methods, (procedure) =>
        MethodDeclarationWriter.write(procedure, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
