import ObjectWriter from "./formatters/object-writer";
import ObjectReader from "./al-readers/object-reader";
import IFormatSetting from "../helpers/models/format-settings.model";
import ICodeComponents from "./code-components";
import CodeComponents from "./code-components";

export default class ObjectFormatter {
  static format(content: string, formatSetting: IFormatSetting): string {
    const codeComponents: ICodeComponents = new CodeComponents();
    const context = ObjectReader.read(content, codeComponents);
    return ObjectWriter.write(context, formatSetting);
  }
}
