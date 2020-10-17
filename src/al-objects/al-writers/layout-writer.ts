import { Helper } from "../helper";
import { ILayout } from "../models/ILayout";
import { ControlWriter } from "./control-writer";

export class LayoutWriter {
  static write(layout: ILayout): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(4);

    lines.push(`${pad}layout`);
    if (layout.postLabelComments.length > 0) {
      layout.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (layout.comments.length > 0) {
      layout.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    layout.controls.forEach((control) => {
      const controlLines = ControlWriter.write(control, 8);
      controlLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }
}
