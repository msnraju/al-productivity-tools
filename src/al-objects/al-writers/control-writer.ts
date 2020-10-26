import IControl from "../models/IControl";
import StringBuilder from "../models/string-builder";
import { ActionContainerWriter } from "./action-container-writer";
import { ProcedureWriter } from "./procedure-writer";

export class ControlWriter {
  static write(control: IControl, indentation: number): string {
    return new StringBuilder()
      .write(control.header, indentation)
      .append(control.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(control, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(control: IControl, indentation: number): string {
    return new StringBuilder()
      .write(control.properties, indentation)
      .emptyLine()
      .writeEach(control.controls, (control) =>
        ControlWriter.write(control, indentation)
      )
      .emptyLine()
      .writeIfDefined(control.container, (container) =>
        ActionContainerWriter.write(container, indentation)
      )
      .emptyLine()
      .writeEach(control.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation)
      )
      .popEmpty()
      .toString();
  }
}
