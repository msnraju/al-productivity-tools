import IKeysContainer from "../components/models/keys-container.model";
import KeyWriter from "./key-writer";
import StringBuilder from "../../helpers/string-builder";

export default class KeysContainerWriter {
  static write(container: IKeysContainer, indentation: number): string {
    return new StringBuilder()
      .write("keys", indentation)
      .write(container.postLabelComments, indentation)
      .write("{", indentation)
      .write(this.writeBody(container, indentation + 4))
      .write("}", indentation)
      .toString();
  }

  private static writeBody(
    container: IKeysContainer,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(container.comments, indentation)
      .writeEach(container.keys, (key) => KeyWriter.write(key, indentation))
      .popEmpty()
      .toString();
  }
}
