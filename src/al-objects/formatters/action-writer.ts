import IAction from "../components/models/IAction";
import StringBuilder from "../models/string-builder";
import MethodDeclarationWriter from "./method-declaration-writer";

export default class ActionWriter {
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
        MethodDeclarationWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
