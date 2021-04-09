import ITokenReader from "../../tokenizers/models/token-reader.model";
import ICodeIndex from "../models/code-index.model";
import IRequestPage from "../components/models/request-page.model";
import RequestPage from "../components/RequestPage";
import ObjectReader from "./object-reader";

export default class RequestPageReader {
  static read(tokenReader: ITokenReader, codeIndex: ICodeIndex): IRequestPage {
    const requestPage: IRequestPage = new RequestPage();

    this.readDeclaration(tokenReader);
    requestPage.postLabelComments = tokenReader.readComments();
    this.readBody(tokenReader, requestPage, codeIndex);

    return requestPage;
  }

  private static readBody(
    tokenReader: ITokenReader,
    requestPage: IRequestPage,
    codeIndex: ICodeIndex
  ) {
    tokenReader.test("{", "Syntax error at Fields declaration, '{' expected.");
    ObjectReader.readBody(tokenReader, requestPage, codeIndex);
    tokenReader.test("}", "Syntax error at Fields declaration, '}' expected.");
  }

  private static readDeclaration(tokenReader: ITokenReader) {
    let name = tokenReader.tokenValue().toLowerCase();
    if (name !== "requestpage") {
      throw new Error(`Invalid requestpage label '${name}'.`);
    }

    tokenReader.readWhiteSpaces();
    return name;
  }
}
