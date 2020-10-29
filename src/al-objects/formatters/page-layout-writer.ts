import IPageLayout from "../components/models/page-layout.model";
import StringBuilder from "../models/string-builder";
import ControlWriter from "./control-writer";

export default class PageLayoutWriter {
  static write(layout: IPageLayout, indentation: number): string {
    return new StringBuilder()
      .write("layout", indentation)
      .write(layout.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(layout, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(layout: IPageLayout, indentation: number): string {
    return new StringBuilder()
      .write(layout.comments, indentation)
      .writeEach(layout.controls, (control) =>
        ControlWriter.write(control, indentation)
      )
      .popEmpty()
      .toString();
  }
}
