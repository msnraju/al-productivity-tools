import ObjectWriter from "./formatters/object-writer";
import ObjectReader from "./al-readers/object-reader";
import IFormatSetting from "../helpers/models/format-settings.model";

export default class ObjectFormatter {
  static format(content: string, formatSetting: IFormatSetting): string {
    return ObjectWriter.write(ObjectReader.read(content), formatSetting);
  }
}
