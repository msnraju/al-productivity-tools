import { IAction } from "../models/IAction";
import { ActionWriter } from "./action-writer";

export default class ActionsWriter {
  static write(actions: Array<IAction>, indentation: number): string[] {
    const lines: string[] = [];
    if (!actions) return lines;

    actions.forEach((action) => {
      lines.push(...ActionWriter.write(action, indentation));
    });

    return lines;
  }
}
