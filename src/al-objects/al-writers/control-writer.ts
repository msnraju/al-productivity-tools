import { Helper } from "../helper";
import { IActionContainer } from "../models/IActionContainer";
import { IControl } from "../models/IControl";
import { IFunction } from "../models/IFunction";
import { ActionContainerWriter } from "./action-container-writer";
import { FunctionWriter } from "./function-writer";

export class ControlWriter {
  static write(control: IControl, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}${control.header}`);
    lines.push(...this.writeComments(control, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeProperties(control.properties, indentation + 4));
    lines.push(...this.writeControls(control.controls, indentation + 4));
    lines.push(...this.writeContainer(control.container, indentation + 4));
    lines.push(...this.writeTriggers(control.triggers, indentation + 4));
    this.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }

  private static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
  }

  private static writeTriggers(
    triggers: Array<IFunction>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!triggers || triggers.length === 0) return lines;

    triggers.forEach((trigger) => {
      lines.push(...FunctionWriter.write(trigger, indentation));
      lines.push("");
    });

    return lines;
  }

  private static writeContainer(
    actionContainer: IActionContainer | undefined,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!actionContainer) return lines;

    lines.push(...ActionContainerWriter.write(actionContainer, indentation));

    return lines;
  }

  private static writeControls(
    controls: Array<IControl>,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!controls) return lines;

    controls.forEach((control) => {
      lines.push(...this.write(control, indentation));
    });

    return lines;
  }

  private static writeComments(
    control: IControl,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);

    control.comments.forEach((line) => lines.push(`${pad}${line}`));

    return lines;
  }

  private static writeProperties(
    properties: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!properties) return lines;

    const pad = Helper.pad(indentation);
    properties.forEach((property) => {
      lines.push(`${pad}${property}`);
    });
    lines.push("");

    return lines;
  }
}
