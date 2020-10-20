import { IAction } from "../models/IAction";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class ActionWriter {
  static write(action: IAction, indentation: number): string {
    return new StringBuilder()
      .write(action.header, indentation)
      .write(action.comments, indentation)
      .write("{", indentation)
      .write(action.properties, indentation + 4)
      .writeEach(action.childActions, (action) =>
        ActionWriter.write(action, indentation + 4)
      )
      .writeEach(action.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation + 4)
      )
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}
