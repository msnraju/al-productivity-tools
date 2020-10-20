import _ = require("lodash");
import { IProcedure } from "../models/IProcedure";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export default class ProceduresWriter {
  static write(procedures: IProcedure[], indentation: number): string {
    if (!procedures || procedures.length === 0) return "";

    procedures = _.sortBy(procedures, (item) => [item.weight]);

    return new StringBuilder()
      .writeEach(procedures, (procedure) =>
        ProcedureWriter.write(procedure, indentation)
      )
      .popEmpty()
      .toString();
  }
}
