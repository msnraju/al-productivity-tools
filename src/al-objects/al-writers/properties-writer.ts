import { Helper } from "../helper";
import StringBuilder from "../models/string-builder";

export default class PropertiesWriter {
  static write(properties: string[], indentation: number): string {
    return new StringBuilder()
      .write(properties, indentation)
      .emptyLine()
      .toString();
  }
}
