import { ActionContainerWriter } from "./action-container-writer";
import { FunctionWriter } from "./function-writer";
import { Helper } from "../helper";
import { IControl } from "../models/IControl";
import { ILayout } from "../models/ILayout";

export class LayoutWriter {
  static layoutToString(layout: ILayout): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}layout`);
    if (layout.postLabelComments.length > 0) {
      layout.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (layout.comments.length > 0) {
      layout.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    layout.controls.forEach((control) => {
      const controlLines = this.controlToString(control, 8);
      controlLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static controlToString(
    control: IControl,
    indentation: number
  ): Array<string> {
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
        const controlLines = this.controlToString(control2, indentation + 4);
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
        const triggerLines = FunctionWriter.functionToString(
          trigger,
          indentation + 4
        );
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
