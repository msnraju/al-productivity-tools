import ObjectWriter from "./formatters/object-writer";
import ObjectReader from "./al-readers/object-reader";

export default class ObjectFormatter {
  static format(content: string): string {
    return ObjectWriter.write(ObjectReader.read(content));
  }
}
