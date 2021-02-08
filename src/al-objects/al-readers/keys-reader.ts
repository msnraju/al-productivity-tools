import ITokenReader from "../../tokenizers/models/token-reader.model";
import KeyReader from "./key-reader";
import IKeysContainer from "../components/models/keys-container.model";
import KeysContainer from "../components/keys-container";

export default class KeysReader {
  static read(tokenReader: ITokenReader): IKeysContainer {
    const container: IKeysContainer = new KeysContainer();

    this.readDeclaration(tokenReader);
    container.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, container);

    return container;
  }

  private static readBody(
    tokenReader: ITokenReader,
    container: IKeysContainer
  ) {
    tokenReader.test("{", "Syntax error at Keys declaration, '{' expected.");

    container.comments = tokenReader.readComments();
    tokenReader.readWhiteSpaces();

    let value = tokenReader.peekTokenValue().toLowerCase();
    while (value === "key") {
      container.keys.push(KeyReader.read(tokenReader));
      value = tokenReader.peekTokenValue().toLowerCase();
    }

    tokenReader.test("}", "Syntax error at Keys declaration, '}' expected.");
  }

  private static readDeclaration(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "keys") {
      throw new Error(`Invalid keys label '${name}'.`);
    }

    tokenReader.readWhiteSpaces();
    return name;
  }
}
