import ITableKey from "../components/models/table-key.model";
import StringBuilder from "../../helpers/string-builder";

export default class KeyWriter {
  static write(key: ITableKey, indentation: number): string {
    return new StringBuilder()
      .write(key.header, indentation)
      .append(key.comments, indentation)
      .write("{", indentation)
      .write(this.writeBody(key, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(key: ITableKey, indentation: number): string {
    return new StringBuilder()
      .write(key.properties, indentation)
      .popEmpty()
      .toString();
  }
}
