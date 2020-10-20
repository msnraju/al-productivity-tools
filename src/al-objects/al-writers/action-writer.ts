import { IAction } from "../models/IAction";
import { Helper } from "../helper";
import CommentWriter from "./comment-writer";
import PropertiesWriter from "./properties-writer";
import FunctionsWriter from "./functions-writer";
import ActionsWriter from "./actions-writer";

export class ActionWriter {
  static write(action: IAction, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}${action.header}`);
    lines.push(...CommentWriter.write(action.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...PropertiesWriter.write(action.properties, indentation + 4));
    lines.push(...ActionsWriter.write(action.childActions, indentation + 4));
    lines.push(...FunctionsWriter.write(action.triggers, indentation + 4));
    Helper.removeBlankLine(lines);
    lines.push(`${pad}}`);
    return lines;
  }
}
