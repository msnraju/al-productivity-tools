import IView from "../models/IView";
import StringBuilder from "../models/string-builder";

export default class ViewWriter {
  static write(view: IView, indentation: number): string {
    return new StringBuilder()
      .write(view.header, indentation)
      .append(view.comments, indentation)
      .write("{", indentation)
      .write(view.properties, indentation + 4)
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}
