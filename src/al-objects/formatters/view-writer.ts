import IView from "../components/models/view.model";
import StringBuilder from "../../helpers/string-builder";

export default class ViewWriter {
  static write(view: IView, indentation: number): string {
    return new StringBuilder()
      .write(view.header, indentation)
      .append(view.comments, indentation)
      .write("{", indentation)
      .write(view.properties.map(p => p.property), indentation + 4)
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}
