import { IActionContainer } from "../models/IActionContainer";
import { Helper } from "../helper";
import { ActionWriter } from "./action-writer";
import { IAction } from "../models/IAction";

export class ActionContainerWriter {
  static write(
    container: IActionContainer,
    indentation: number
  ): Array<string> {
    const lines: Array<string> = [];    
    const pad = Helper.pad(indentation);
    
    lines.push(`${pad}actions`);

    this.writeComments(container.postLabelComments, lines, indentation);

    lines.push(`${pad}{`);

    this.writeComments(container.comments, lines, indentation);
    this.writeActions(container.actions, lines, indentation);

    lines.push(`${pad}}`);
    return lines;
  }

  private static writeActions(
    actions: IAction[],
    lines: string[],
    indentation: number
  ) {
    if (!actions) return;

    actions.forEach((action) => {
      const fieldLines = ActionWriter.write(action, indentation + 4);
      fieldLines.forEach((line) => lines.push(line));
    });
  }

  private static writeComments(
    comments: string[],
    lines: string[],
    indentation: number
  ) {
    if (!comments) return;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));
  }
}
