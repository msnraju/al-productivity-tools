import { Helper } from "../helper";
import { IControl } from "../models/IControl";
import { ActionContainerWriter } from "./action-container-writer";
import { FunctionWriter } from "./function-writer";

export class ControlWriter {
  static write(control: IControl, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);
    const pad12 = Helper.pad(indentation + 4);

    lines.push(`${pad}${control.header}`);
    control.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (control.properties.length > 0) {
      control.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push("");
    }

    if (control.controls.length > 0) {
      control.controls.forEach((control2) => {
        const controlLines = this.write(control2, indentation + 4);
        controlLines.forEach((line) => lines.push(line));
      });
    }

    if (control.actionContainer) {
      const actionLines = ActionContainerWriter.write(
        control.actionContainer,
        indentation + 4
      );

      actionLines.forEach((line) => lines.push(line));
    }

    if (control.triggers.length > 0) {
      control.triggers.forEach((trigger) => {
        const triggerLines = FunctionWriter.write(trigger, indentation + 4);
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
