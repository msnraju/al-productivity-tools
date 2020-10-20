import { IActionContainer } from "../models/IActionContainer";
import { Helper } from "../helper";
import CommentWriter from "./comment-writer";
import ActionsWriter from "./actions-writer";

export class ActionContainerWriter {
  static write(container: IActionContainer, indentation: number): string[] {
    const pad = Helper.pad(indentation);

    const lines: string[] = [];
    lines.push(`${pad}actions`);
    lines.push(
      ...CommentWriter.write(container.preBodyComments, indentation)
    );
    lines.push(`${pad}{`);
    lines.push(...CommentWriter.write(container.comments, indentation + 4));
    lines.push(...ActionsWriter.write(container.actions, indentation + 4));
    lines.push(`${pad}}`);

    return lines;
  }
}
