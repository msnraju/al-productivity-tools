import { Helper } from "../helper";
import { IView } from "../models/IView";

export class ViewWriter {
  static write(view: IView, indentation: number): string[] {
    const lines: string[] = [];
    const pad = Helper.pad(indentation);
    const pad12 = Helper.pad(indentation + 4);

    lines.push(`${pad}${view.header}`);
    lines.push(...this.writeComments(view.comments, indentation));
    lines.push(`${pad}{`);
    lines.push(...this.writeProperties(view.properties, indentation + 4));
    this.removeBlankLine(lines);
    lines.push(`${pad}}`);
    
    return lines;
  }

  private static removeBlankLine(lines: string[]) {
    if (lines[lines.length - 1] === "") lines.pop();
  }


  private static writeProperties(
    properties: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!properties || properties.length > 0) return lines;

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
    const lines: string[] = [];

    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));
    return lines;
  }
}
