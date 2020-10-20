import { Helper } from "../helper";
import { IControl } from "../models/IControl";
import { ILayout } from "../models/ILayout";
import CommentWriter from "./comment-writer";
import { ControlWriter } from "./control-writer";

export class LayoutWriter {
  static write(layout: ILayout): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}layout`);
    lines.push(...CommentWriter.write(layout.postLabelComments, 4));
    lines.push(`${pad}{`);
    lines.push(...CommentWriter.write(layout.comments, 8));
    lines.push(...this.writeControls(layout.controls, 8));
    lines.push(`${pad}}`);

    return lines;
  }

  private static writeControls(
    controls: Array<IControl>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!controls) return lines;

    controls.forEach((control) => {
      lines.push(...ControlWriter.write(control, indentation));
    });

    return lines;
  }
}
