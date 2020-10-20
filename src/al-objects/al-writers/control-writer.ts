import { IControl } from "../models/IControl";
import StringBuilder from "../models/string-builder";
import { ActionContainerWriter } from "./action-container-writer";
import { ProcedureWriter } from "./procedure-writer";

export class ControlWriter {
  static write(control: IControl, indentation: number): string {
    return new StringBuilder()
      .write(control.header, indentation)
      .write(control.comments, indentation)
      .write("{", indentation)
      .write(control.properties, indentation + 4)
      .writeEach(control.controls, (control) =>
        ControlWriter.write(control, indentation + 4)
      )
      .writeIfDefined(control.container, (container) =>
        ActionContainerWriter.write(container, indentation + 4)
      )
      .writeEach(control.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation + 4)
      )
      .write("}", indentation)
      .toString();
  }
}
