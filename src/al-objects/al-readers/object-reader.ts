import OBJECT_TYPE_KEYWORDS from "../maps/object-type-keywords";
import StringHelper from "../string-helper";
import Tokenizer from "../tokenizer";
import IToken from "../models/IToken";
import VarSectionReader from "./var-section-reader";
import MethodDeclarationReader from "./method-declaration-reader";
import FieldsReader from "./fields-reader";
import PropertyReader from "./property-reader";
import PageLayoutReader from "./page-layout-reader";
import ActionContainerReader from "./action-container-reader";
import DataSetReader from "./dataset-reader";
import SchemaReader from "./schema-reader";
import ViewContainerReader from "./view-container-reader";
import IObjectContext from "../components/models/IObjectContext";
import ITokenReader from "../models/ITokenReader";
import TokenReader from "../token-reader";
import ObjectContext from "../components/object-context";
import KeysReader from "./keys-reader";
import FieldGroupsReader from "./field-groups-reader";

export default class ObjectReader {
  static read(content: string): IObjectContext {
    const context = this.getReadContext(content);
    const appObject = new ObjectContext();

    appObject.header = ObjectReader.readHeader(context);
    this.readBody(context, appObject);
    appObject.footer = this.readFooter(context);

    return appObject;
  }

  private static readBody(
    tokenReader: ITokenReader,
    appObject: IObjectContext
  ) {
    let comments: string[] = [];

    let value = tokenReader.peekTokenValue().toLowerCase();

    while (value !== "}") {
      switch (value) {
        case "var":
          appObject.variables = VarSectionReader.read(tokenReader);
          break;
        case "[":
        case "local":
        case "internal":
        case "procedure":
          appObject.procedures.push(
            MethodDeclarationReader.read(tokenReader, comments)
          );
          comments = [];
          break;
        case "trigger":
          appObject.triggers.push(MethodDeclarationReader.read(tokenReader, comments));
          comments = [];
          break;
        // Table
        case "fields":
          appObject.fields = FieldsReader.read(tokenReader);
          break;
        case "keys":
          appObject.keys = KeysReader.read(tokenReader);
          break;
        case "fieldgroups":
          appObject.fieldGroups = FieldGroupsReader.read(tokenReader);
          break;
        // Page
        case "layout":
          appObject.layout = PageLayoutReader.read(tokenReader);
          break;
        case "views":
          appObject.views = ViewContainerReader.read(tokenReader);
          break;
        case "actions":
          appObject.actions = ActionContainerReader.read(tokenReader);
          break;
        // Report
        case "dataset":
          appObject.dataSet = DataSetReader.read(tokenReader);
          break;
        // XmlPort
        case "schema":
          appObject.schema = SchemaReader.read(tokenReader);
          break;
        // Report
        case "requestpage":
        case "labels":
        // Report
        case "elements":
        // EnumExtension
        case "value":
          appObject.segments.push({
            name: value,
            tokens: this.readBracesSegment(tokenReader),
          });
          break;
        default:
          if (tokenReader.tokenType() === "comment") {
            comments.push(...tokenReader.readComments());
          } else {
            appObject.properties.push(...comments);
            comments = [];
            appObject.properties.push(PropertyReader.read(tokenReader));
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

  private static readHeader(tokenReader: ITokenReader): string {
    const tokens: IToken[] = [];
    while (tokenReader.peekTokenValue() !== "{") {
      tokens.push(tokenReader.token());
    }

    if (tokenReader.peekTokenValue() !== "{") {
      throw new Error("body begin error");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();
    return StringHelper.tokensToString(tokens, OBJECT_TYPE_KEYWORDS);
  }

  private static readFooter(tokenReader: ITokenReader): string {
    const tokens: IToken[] = [];
    if (tokenReader.peekTokenValue() !== "}") {
      throw new Error("end body error");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();
    return StringHelper.tokensToString(tokens);
  }

  private static readBracesSegment(tokenReader: ITokenReader): IToken[] {
    const tokens: IToken[] = [];
    let counter = 0;
    let value = tokenReader.peekTokenValue();
    while (value !== "}" || counter !== 0) {
      tokens.push(tokenReader.token());

      value = tokenReader.peekTokenValue();
      if (value === "{") {
        counter++;
      } else if (value === "}") {
        counter--;
      }
    }

    if (tokenReader.peekTokenValue() !== "}" || counter !== 0) {
      throw new Error("segment end error.");
    }

    tokens.push(tokenReader.token());
    tokenReader.readWhiteSpaces();
    return tokens;
  }
}
