import IPageLayout from "../components/models/page-layout.model";
import StringBuilder from "../../helpers/string-builder";
import ControlWriter from "./control-writer";
import IFormatSetting from "../../helpers/models/format-settings.model";
import IObjectContext from "../components/models/object-context.model";

export default class PageLayoutWriter {
  static write(
    layout: IPageLayout,
    appObject: IObjectContext,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write("layout", indentation)
      .write(layout.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(layout, appObject, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    layout: IPageLayout,
    appObject: IObjectContext,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(layout.comments, indentation)
      .writeEach(layout.controls, (control) =>
        ControlWriter.write(control, appObject, formatSetting, indentation)
      )
      .popEmpty()
      .toString();
  }
}
