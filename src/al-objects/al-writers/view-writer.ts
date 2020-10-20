import { Helper } from "../helper";
import { IView } from "../models/IView";
import CommentWriter from "./comment-writer";
import PropertiesWriter from "./properties-writer";

export class ViewWriter {
  static write(view: IView, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);

    lines.push(`${pad}${view.header}`);
    lines.push(...CommentWriter.write(view.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...PropertiesWriter.write(view.properties, indentation + 4));
    Helper.removeBlankLine(lines);
    lines.push(`${pad}}`);

    return lines;
  }
}
