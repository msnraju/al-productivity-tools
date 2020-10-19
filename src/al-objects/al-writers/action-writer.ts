import { IFunction } from "../models/IFunction";
import { IAction } from "../models/IAction";
import { Helper } from "../helper";
import { FunctionWriter } from "./function-writer";

export class ActionWriter {
  static write(action: IAction, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}${action.header}`);
    lines.push(...this.writeComments(action.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeProperties(action.properties, indentation + 4));
    lines.push(...this.writeActions(action.childActions, indentation + 4));
    lines.push(...this.writeTriggers(action.triggers, indentation + 4));
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
    if (!triggers) return lines;

    triggers.forEach((trigger) => {
      lines.push(...FunctionWriter.write(trigger, indentation));
      lines.push("");
    });

    return lines;
  }

  private static writeActions(
    actions: Array<IAction>,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!actions) return lines;

    actions.forEach((action) => {
      lines.push(...this.write(action, indentation));
    });

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

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const pad = Helper.pad(indentation);
    const lines: string[] = [];
    comments.forEach((line) => lines.push(`${pad}${line}`));
    return lines;
  }
}
