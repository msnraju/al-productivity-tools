import { Helper } from "../helper";
import { IViewContainer } from "../models/IViewContainer";
import { ViewWriter } from "./view-writer";

export class ViewContainerWriter {
  static write(container: IViewContainer, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);

    lines.push(`${pad}views`);
    if (container.postLabelComments.length > 0) {
      container.postLabelComments.forEach((line) =>
        lines.push(`${pad}${line}`)
      );
    }
    lines.push(`${pad}{`);
    if (container.comments.length > 0) {
      container.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    container.views.forEach((view) => {
      const fieldLines = ViewWriter.write(view, indentation + 4);
      fieldLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }
}
