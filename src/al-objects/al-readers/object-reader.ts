import { Helper } from "../helper";
import { IToken, Tokenizer } from "../tokenizer";
import { VariablesReader } from "./variables-reader";
import { FunctionReader } from "./function-reader";
import { Keywords } from "../keywords";
import { FieldsReader } from "./fields-reader";
import { PropertyReader } from "./property-reader";
import { LayoutReader } from "./layout-reader";
import { ActionContainerReader } from "./action-container-reader";
import { DataSetReader } from "./dataset-reader";
import { SchemaReader } from "./schema-reader";
import { ViewContainerReader } from "./view-container-reader";
import { IObjectContext } from "../models/IObjectContext";
import { IReadContext } from "../models/IReadContext";

export class ObjectReader {
  static read(content: string): IObjectContext {
    const context = this.getReadContext(content);
    const appObject = this.getContextInstance();

    appObject.header = ObjectReader.readHeader(context);
    this.readBody(context, appObject);
    appObject.footer = this.readFooter(context);

    return appObject;
  }

  private static readBody(context: IReadContext, appObject: IObjectContext) {
    let comments: string[] = [];

    let value: string = context.tokens[context.pos].value.toLowerCase();

    while (value !== "}") {
      switch (value) {
        case "var":
          appObject.variables = VariablesReader.read(context);
          break;
        case "[":
        case "local":
        case "internal":
        case "procedure":
          appObject.procedures.push(FunctionReader.read(context, comments));
          comments = [];
          break;
        case "trigger":
          appObject.triggers.push(FunctionReader.read(context, comments));
          comments = [];
          break;
        // Table
        case "fields":
          appObject.fields = FieldsReader.read(context);
          break;
        // Page
        case "layout":
          appObject.layout = LayoutReader.read(context);
          break;
        case "views":
          appObject.views = ViewContainerReader.read(context);
          break;
        case "actions":
          appObject.actions = ActionContainerReader.read(context);
          break;
        // Report
        case "dataset":
          appObject.dataSet = DataSetReader.read(context);
          break;
        // XmlPort
        case "schema":
          appObject.schema = SchemaReader.read(context);
          break;
        // Table
        case "keys":
        case "fieldgroups":
        // Report
        case "requestpage":
        case "labels":
        // Report
        case "elements":
        // EnumExtension
        case "value":
          appObject.segments.push({
            name: value,
            tokens: this.readBracesSegment(context),
          });
          break;
        default:
          if (context.tokens[context.pos].type === "comment") {
            comments.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            comments.forEach((comment) => appObject.properties.push(comment));
            comments = [];
            appObject.properties.push(PropertyReader.read(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLowerCase();
    }
  }

  private static getReadContext(content: string) {
    const tokens = Tokenizer.tokenizer(content);
    const context: IReadContext = {
      tokens: tokens,
      pos: 0,
    };
    return context;
  }

  private static getContextInstance(): IObjectContext {
    return {
      header: "",
      footer: "",
      variables: [],
      procedures: [],
      triggers: [],
      segments: [],
      properties: [],
    };
  }

  private static readHeader(context: IReadContext): string {
    const tokens: Array<IToken> = [];
    while (context.tokens[context.pos].value !== "{") {
      tokens.push(context.tokens[context.pos++]);
    }

    if (context.tokens[context.pos].value !== "{")
      throw new Error("body begin error");

    tokens.push(context.tokens[context.pos++]);
    Helper.readWhiteSpaces(context, []);
    return Helper.tokensToString(tokens, Keywords.ObjectTypes);
  }

  private static readFooter(context: IReadContext): string {
    const tokens: Array<IToken> = [];
    if (context.tokens[context.pos].value !== "}") {
      throw new Error("end body error");
    }

    tokens.push(context.tokens[context.pos++]);
    Helper.readWhiteSpaces(context, []);
    return Helper.tokensToString(tokens, []);
  }

  private static readBracesSegment(context: IReadContext): Array<IToken> {
    const tokens: Array<IToken> = [];
    let counter = 0;
    let value = context.tokens[context.pos].value;

    while (value !== "}" || counter !== 0) {
      tokens.push(context.tokens[context.pos]);
      value = context.tokens[++context.pos].value;
      if (value === "{") counter++;
      else if (value === "}") counter--;
    }

    if (context.tokens[context.pos].value !== "}" || counter !== 0)
      throw new Error("segment end error.");

    tokens.push(context.tokens[context.pos++]);

    Helper.readWhiteSpaces(context, []);
    return tokens;
  }
}
