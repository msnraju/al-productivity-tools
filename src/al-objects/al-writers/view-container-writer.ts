import { commands } from "vscode";
import { Helper } from "../helper";
import { IView } from "../models/IView";
import { IViewContainer } from "../models/IViewContainer";
import { ViewWriter } from "./view-writer";

export class ViewContainerWriter {
  static write(container: IViewContainer, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);

    lines.push(`${pad}views`);
    lines.push(...this.writeComments(container.postLabelComments, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeComments(container.comments, indentation + 4));
    lines.push(...this.writeViews(container.views, indentation + 4));
    lines.push(`${pad}}`);
    return lines;
  }

  private static writeViews(
    views: Array<IView>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!views) return lines;
    views.forEach((view) => {
      lines.push(...ViewWriter.write(view, indentation));
    });

    return lines;
  }

  private static writeComments(
    comments: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));
    return lines;
  }
}
