import { Helper } from "../helper";

export default class CommentWriter {
  static write(comments: string[], indentation: number): string[] {
    const lines: string[] = [];
    if (!comments) return lines;

    const pad = Helper.pad(indentation);
    comments.forEach((line) => lines.push(`${pad}${line}`));
    return lines;
  }
}
