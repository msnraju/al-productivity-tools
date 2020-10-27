import ObjectWriter from "./al-writers/object-writer";
import ObjectReader from "./al-readers/object-reader";

export class ObjectFormatter {
  static format(content: string): string {
    return ObjectWriter.write(ObjectReader.read(content));
  }
}
