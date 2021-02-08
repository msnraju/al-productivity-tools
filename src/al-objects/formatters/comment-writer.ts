import StringBuilder from "../../helpers/string-builder";

export default class CommentWriter {
  static write(comments: string[], indentation: number): string {
    return new StringBuilder().write(comments, indentation).toString();
  }
}
