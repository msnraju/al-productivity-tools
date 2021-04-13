import OBJECT_TYPE_KEYWORDS from "../maps/object-type-keywords";
import Tokenizer from "../../tokenizers/tokenizer";
import VarSectionReader from "./var-section-reader";
import MethodDeclarationReader from "./method-declaration-reader";
import FieldsReader from "./fields-reader";
import PropertyReader from "./property-reader";
import PageLayoutReader from "./page-layout-reader";
import ActionContainerReader from "./action-container-reader";
import DataSetReader from "./dataset-reader";
import SchemaReader from "./schema-reader";
import ViewContainerReader from "./view-container-reader";
import IObjectContext from "../components/models/object-context.model";
import ITokenReader from "../../tokenizers/models/token-reader.model";
import ObjectContext from "../components/object-context";
import KeysReader from "./keys-reader";
import FieldGroupsReader from "./field-groups-reader";
import IToken from "../../tokenizers/models/token.model";
import TokenReader from "../../tokenizers/token-reader";
import ICodeIndex from "../models/code-index.model";
import RequestPageReader from "./request-page-reader";

export default class ObjectReader {
  static read(content: string, codeIndex: ICodeIndex): IObjectContext {
    const context = ObjectReader.getReadContext(content);
    const appObject = new ObjectContext();

    ObjectReader.readObjectHeader(appObject, context);
    ObjectReader.readBody(context, appObject, codeIndex);
    appObject.footer = ObjectReader.readFooter(context);

    return appObject;
  }

  public static readBody(
    tokenReader: ITokenReader,
    appObject: IObjectContext,
    codeIndex: ICodeIndex
  ) {
    let comments: string[] = [];
    let value = tokenReader.peekTokenValue().toLowerCase();

    while (value !== "}") {
      switch (value.toLowerCase()) {
        case "protected":
        case "var":
          appObject.variables = VarSectionReader.read(tokenReader);
          break;
        case "[":
        case "local":
        case "internal":
        case "procedure":
          appObject.procedures.push(
            MethodDeclarationReader.read(tokenReader, comments, codeIndex)
          );
          comments = [];
          break;
        case "trigger":
          appObject.triggers.push(
            MethodDeclarationReader.read(tokenReader, comments, codeIndex)
          );
          comments = [];
          break;
        // Table
        case "fields":
          appObject.fields = FieldsReader.read(tokenReader, codeIndex);
          break;
        case "keys":
          appObject.keys = KeysReader.read(tokenReader, codeIndex);
          break;
        case "fieldgroups":
          appObject.fieldGroups = FieldGroupsReader.read(
            tokenReader,
            codeIndex
          );
          break;
        // Page
        case "layout":
          appObject.layout = PageLayoutReader.read(tokenReader, codeIndex);
          break;
        case "views":
          appObject.views = ViewContainerReader.read(tokenReader, codeIndex);
          break;
        case "actions":
          appObject.actionsContainer = ActionContainerReader.read(
            tokenReader,
            codeIndex
          );
          break;
        // Report
        case "dataset":
          appObject.dataSet = DataSetReader.read(tokenReader, codeIndex);
          break;
        // XmlPort
        case "schema":
          appObject.schema = SchemaReader.read(tokenReader, codeIndex);
          break;
        // Report
        case "requestpage":
          appObject.requestPage = RequestPageReader.read(tokenReader, codeIndex);
          break;
        case "labels":
        // Report
        case "elements":
        // dotnet
        case "assembly":
        // EnumExtension
        case "value":
          const tokens = tokenReader.readBracesSegment();
          codeIndex.pushCodeTokens(tokens);

          appObject.segments.push({
            name: value,
            tokens: tokens,
          });
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            comments.forEach((p) =>
              appObject.properties.push({ name: "//", property: p })
            );
            comments = [];
            appObject.properties.push(
              PropertyReader.read(tokenReader, codeIndex)
            );
          }
          break;
      }

      tokenReader.readWhiteSpaces();
      value = tokenReader.peekTokenValue().toLowerCase();
    }
  }

  private static getReadContext(content: string): ITokenReader {
    return new TokenReader(Tokenizer.tokenizer(content));
  }

  private static readObjectHeader(
    appObject: IObjectContext,
    tokenReader: ITokenReader
  ) {
    const tokens: IToken[] = [];
    const values: string[] = [];
    let value = tokenReader.peekTokenValue();
    while (value !== "{") {
      if (value.trim() !== "" && value.trim() !== ",") {
        values.push(value);
      }

      tokens.push(tokenReader.token());
      value = tokenReader.peekTokenValue();
    }

    if (tokenReader.peekTokenValue() !== "{") {
      throw new Error("body begin error");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();
    appObject.header = TokenReader.tokensToString(tokens, OBJECT_TYPE_KEYWORDS);
    appObject.declaration.updateFromHeaderValues(values);
  }

  private static readFooter(tokenReader: ITokenReader): string {
    const tokens: IToken[] = [];
    if (tokenReader.peekTokenValue() !== "}") {
      throw new Error("end body error");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();
    return TokenReader.tokensToString(tokens);
  }
}
