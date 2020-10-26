import { IAction } from "../models/IAction";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class ActionWriter {
  static write(action: IAction, indentation: number): string {
    return new StringBuilder()
      .write(action.header, indentation)
      .append(action.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(action, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(action: IAction, indentation: number): string {
    return new StringBuilder()
      .write(action.properties, indentation)
      .emptyLine()
      .writeEach(action.childActions, (action) =>
        ActionWriter.write(action, indentation)
      )
      .emptyLine()
      .writeEach(action.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
