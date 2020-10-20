import { Helper } from "../helper";
import { IActionContainer } from "../models/IActionContainer";
import { IControl } from "../models/IControl";
import { ActionContainerWriter } from "./action-container-writer";
import CommentWriter from "./comment-writer";
import ProceduresWriter from "./procedures-writer";
import PropertiesWriter from "./properties-writer";

export class ControlWriter {
  static write(control: IControl, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}${control.header}`);
    lines.push(...CommentWriter.write(control.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...PropertiesWriter.write(control.properties, indentation + 4));
    lines.push(...this.writeControls(control.controls, indentation + 4));
    lines.push(...this.writeContainer(control.container, indentation + 4));
    lines.push(...ProceduresWriter.write(control.triggers, indentation + 4));
    Helper.removeBlankLine(lines);
    lines.push(`${pad}}`);

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
}
