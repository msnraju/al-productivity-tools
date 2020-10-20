import { IViewContainer } from "../models/IViewContainer";
import StringBuilder from "../models/string-builder";
import { ViewWriter } from "./view-writer";

export class ViewContainerWriter {
  static write(container: IViewContainer, indentation: number): string {
    return new StringBuilder()
      .write("views", indentation)
      .write(container.postLabelComments, indentation)
      .write("{", indentation)
      .write(container.comments, indentation + 4)
      .writeEach(container.views, (view) =>
        ViewWriter.write(view, indentation + 4)
      )
      .popEmpty()
      .write("}", indentation)
      .toString();
  }
}
