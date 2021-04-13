import StringBuilder from "../../helpers/string-builder";
import IFormatSetting from "../../helpers/models/format-settings.model";
import IRequestPage from "../components/models/request-page.model";
import ObjectWriter from "./object-writer";
import CodeIndex from "../code-index";

export default class RequestPageWriter {
  static write(
    requestPage: IRequestPage,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    return new StringBuilder()
      .write("requestpage", indentation)
      .write(requestPage.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(requestPage, formatSetting, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    requestPage: IRequestPage,
    formatSetting: IFormatSetting,
    indentation: number
  ): string {
    const codeIndex = new CodeIndex();
    return ObjectWriter.writeBody(
      requestPage,
      formatSetting,
      indentation,
      codeIndex
    );
  }
}
