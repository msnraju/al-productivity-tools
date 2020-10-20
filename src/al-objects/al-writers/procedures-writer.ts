import _ = require("lodash");
import { IProcedure } from "../models/IProcedure";
import { ProcedureWriter } from "./procedure-writer";

export default class ProceduresWriter {
  static write(procedures: IProcedure[], indentation: number): string[] {
    const lines: string[] = [];

    if (!procedures || procedures.length === 0) return lines;

    procedures = _.sortBy(procedures, (item) => [item.weight]);
    procedures.forEach((func) => {
      lines.push(...ProcedureWriter.write(func, indentation));
      lines.push("");
    });

    return lines;
  }
}
