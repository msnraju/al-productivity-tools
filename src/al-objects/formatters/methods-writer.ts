import _ = require("lodash");
import IMethodDeclaration from "../components/models/method-declaration.model";
import StringBuilder from "../../helpers/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";

export default class MethodsWriter {
  static write(methods: IMethodDeclaration[], indentation: number): string {
    if (!methods || methods.length === 0) return "";

    methods = _.sortBy(methods, (item) => [item.weight]);

    return new StringBuilder()
      .writeEach(methods, (procedure) =>
        MethodDeclarationWriter.write(procedure, indentation)
      )
      .popEmpty()
      .toString();
  }
}
