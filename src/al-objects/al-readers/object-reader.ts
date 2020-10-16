import { Helper } from "../helper";
import { Tokenizer, IToken } from "../tokenizer";
import { VariableReader } from "./variable-reader";
import { FunctionReader } from "./function-reader";
import { Keywords } from "../keywords";
import { FieldsReader } from "./fields-reader";
import { PropertyReader } from "./property-reader";
import { LayoutReader } from "./layout-reader";
import { ActionsReader } from "./actions-reader";
import { DataSetReader } from "./dataset-reader";
import { SchemaReader } from "./schema-reader";
import { ViewsReader } from "./views-reader";
import { IObjectContext } from "../models/IObjectContext";
import { IReadContext } from "../models/IReadContext";
import { ObjectWriter } from "../al-writers/object-writer";

export class ObjectReader {
  static convert(content: string): string {
    const tokens = Tokenizer.tokenizer(content);
    const context: IReadContext = {
      tokens: tokens,
      pos: 0,
    };

    const appObject = this.readObject(context);
    return ObjectWriter.objectToString(appObject);
  }

  static readObject(context: IReadContext): IObjectContext {
    const appObject: IObjectContext = {
      header: "",
      footer: "",
      variables: [],
      procedures: [],
      triggers: [],
      segments: [],
      properties: [],
    };

    appObject.header = Helper.tokensToString(
      ObjectReader.readHeader(context),
      Keywords.ObjectTypes
    );

    let comments: string[] = [];

    let value: string = context.tokens[context.pos].value.toLocaleLowerCase();

    while (value !== "}") {
      switch (value) {
        case "var":
          appObject.variables = VariableReader.readVariables(context);
          break;
        case "[":
        case "local":
        case "internal":
        case "procedure":
          appObject.procedures.push(
            FunctionReader.readFunction(context, comments)
          );
          comments = [];
          break;
        case "trigger":
          appObject.triggers.push(
            FunctionReader.readFunction(context, comments)
          );
          comments = [];
          break;
        // Table
        case "fields":
          appObject.fields = FieldsReader.readFields(context);
          break;
        // Page
        case "layout":
          appObject.layout = LayoutReader.readLayout(context);
          break;
        case "views":
          appObject.views = ViewsReader.readViews(context);
          break;
        case "actions":
          appObject.actions = ActionsReader.readActions(context);
          break;
        // Report
        case "dataset":
          appObject.dataSet = DataSetReader.readDataSet(context);
          break;
        // XmlPort
        case "schema":
          appObject.schema = SchemaReader.readSchema(context);
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
            appObject.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    appObject.footer = Helper.tokensToString(this.readFooter(context), {});

    return appObject;
  }

  private static readHeader(context: IReadContext): Array<IToken> {
    const tokens: Array<IToken> = [];
    while (context.tokens[context.pos].value !== "{") {
      tokens.push(context.tokens[context.pos++]);
    }

    if (context.tokens[context.pos].value !== "{")
      throw new Error("body begin error");

    tokens.push(context.tokens[context.pos++]);
    Helper.readWhiteSpaces(context, []);
    return tokens;
  }

  private static readFooter(context: IReadContext): Array<IToken> {
    const tokens: Array<IToken> = [];
    if (context.tokens[context.pos].value !== "}")
      throw new Error("end body error");

    tokens.push(context.tokens[context.pos++]);
    Helper.readWhiteSpaces(context, []);
    return tokens;
  }

  static readBeginEndSegment(context: IReadContext): Array<IToken> {
    const tokens: Array<IToken> = [];
    let counter = 0;
    let value = context.tokens[context.pos].value.toLocaleLowerCase();

    while (value !== "end" || counter !== 0) {
      tokens.push(context.tokens[context.pos]);
      value = context.tokens[++context.pos].value.toLocaleLowerCase();
      if (value === "begin" || value === "case") counter++;
      else if (value === "end") counter--;
    }

    if (value !== "end" || counter !== 0) throw new Error("trigger end error.");

    tokens.push(context.tokens[context.pos++]);

    if (context.tokens[context.pos].value !== ";")
      throw new Error("trigger end error.");

    tokens.push(context.tokens[context.pos++]);
    Helper.readWhiteSpaces(context, tokens);
    return tokens;
  }

  static readBracesSegment(context: IReadContext): Array<IToken> {
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
