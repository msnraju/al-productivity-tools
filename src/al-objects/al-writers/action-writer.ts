import { IFunction } from "../models/IFunction";
import { IAction } from "../models/IAction";
import { Helper } from "../helper";
import { FunctionWriter } from "./function-writer";

export class ActionWriter {
  static write(action: IAction, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);
    const pad2 = Helper.pad(indentation + 4);

    lines.push(`${pad}${action.header}`);

    this.writeComments(action.comments, lines, pad);

    lines.push(`${pad}{`);

    this.writeProperties(action.properties, lines, pad2);
    this.writeChildActions(action.childActions, indentation, lines);
    this.writeTriggers(action.triggers, indentation, lines);

    if (lines[lines.length - 1] === "") lines.pop();

    lines.push(`${pad}}`);
    return lines;
  }

  private static writeTriggers(
    triggers: Array<IFunction>,
    indentation: number,
    lines: string[]
  ) {
    if (!triggers) return;

    triggers.forEach((trigger) => {
      const triggerLines = FunctionWriter.functionToString(
        trigger,
        indentation + 4
      );
      triggerLines.forEach((line) => lines.push(line));
      lines.push("");
    });
  }

  private static writeChildActions(
    childActions: Array<IAction>,
    indentation: number,
    lines: string[]
  ) {
    if (!childActions) return;

    childActions.forEach((action) => {
      const fieldLines = this.write(action, indentation + 4);
      fieldLines.forEach((line) => lines.push(line));
    });
  }

  private static writeProperties(
    properties: string[],
    lines: string[],
    pad: string
  ) {
    if (!properties) return;

    properties.forEach((property) => {
      lines.push(`${pad}${property}`);
    });

    lines.push("");
  }

  private static writeComments(
    comments: string[],
    lines: string[],
    pad: string
  ) {
    comments.forEach((line) => lines.push(`${pad}${line}`));
  }
}
