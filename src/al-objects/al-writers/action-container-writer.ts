import { IActionContainer } from "../models/IActionContainer";
import { Helper } from "../helper";
import { ActionWriter } from "./action-writer";
import { IAction } from "../models/IAction";

export class ActionContainerWriter {
  static write(
    container: IActionContainer,
    indentation: number
  ): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}actions`);
    lines.push(...this.writeComments(container.postLabelComments, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeComments(container.comments, indentation + 4));
    lines.push(...this.writeActions(container.actions, indentation + 4));
    lines.push(`${pad}}`);

    return lines;
  }

  private static writeActions(
    actions: IAction[],
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!actions) return lines;

    actions.forEach((action) => {
      lines.push(...ActionWriter.write(action, indentation));
    });

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));
    return lines;
  }
}
