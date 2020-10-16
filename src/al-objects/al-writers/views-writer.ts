import { Helper } from "../helper";
import { IView } from "../models/IView";
import { IViewContainer } from "../models/IViewContainer";

export class ViewsWriter {
  static viewContainerToString(
    container: IViewContainer,
    indentation: number
  ): Array<string> {
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
      const fieldLines = this.viewToString(view, indentation + 4);
      fieldLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static viewToString(view: IView, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = Helper.pad(indentation);
    const pad12 = Helper.pad(indentation + 4);

    lines.push(`${pad}${view.header}`);
    view.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (view.properties.length > 0) {
      view.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push("");
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
