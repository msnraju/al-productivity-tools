import ObjectWriter from "./formatters/object-writer";
import ObjectReader from "./al-readers/object-reader";
import IFormatSetting from "../helpers/models/format-settings.model";
import CodeIndex from "./code-index";
import ICodeIndex from "./models/code-index.model";
import { AppSymbols } from "../symbol-references";

export default class ObjectFormatter {
  static format(
    content: string,
    formatSetting: IFormatSetting
  ): string {
    const codeIndex: ICodeIndex = new CodeIndex();
    const context = ObjectReader.read(content, codeIndex);
    return ObjectWriter.write(context, formatSetting, codeIndex);
  }
}
