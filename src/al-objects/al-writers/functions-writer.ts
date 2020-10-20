import _ = require("lodash");
import { IFunction } from "../models/IFunction";
import { FunctionWriter } from "./function-writer";

export default class FunctionsWriter {
  static write(functions: Array<IFunction>, indentation: number): string[] {
    const lines: string[] = [];

    if (!functions || functions.length === 0) return lines;

    functions = _.sortBy(functions, (item) => [item.weight]);
    functions.forEach((func) => {
      lines.push(...FunctionWriter.write(func, indentation));
      lines.push("");
    });

    return lines;
  }
}
