import IViewContainer from "../models/IViewContainer";
import StringBuilder from "../models/string-builder";
import ViewWriter from "./view-writer";

export default class ViewContainerWriter {
  static write(container: IViewContainer, indentation: number): string {
    return new StringBuilder()
      .write("views", indentation)
      .write(container.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(container, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    container: IViewContainer,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(container.comments, indentation)
      .writeEach(container.views, (view) => ViewWriter.write(view, indentation))
      .popEmpty()
      .toString();
  }
}
