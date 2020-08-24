import { Tokenizer, IToken } from "./tokenizer";
import { Helper } from "./helper";
import { VariableReader, IVariable } from "./variable-reader";
import { FunctionReader, IFunction } from "./function-reader";
import { Keywords } from "./keywords";
import { FieldsReader, IField, IFieldsContainer } from "./fields-reader";
import { PropertyReader } from "./property-reader";
import { LayoutReader, ILayout } from "./layout-reader";
import { ActionsReader, IActionContainer } from "./actions-reader";
import { DataSetReader, IDataSet } from "./dataset-reader";
import { schemaReader, ISchema } from "./schema-reader";
import { ViewsReader, IViewContainer } from "./views-reader";
import _ = require("lodash");

export interface ISegment {
  name: string;
  tokens: Array<IToken>;
}

export interface IObjectContext {
  views?: IViewContainer;
  schema?: ISchema;
  dataSet?: IDataSet;
  actions?: IActionContainer;
  layout?: ILayout;
  header: string;
  footer: string;
  fields?: IFieldsContainer;
  variables: Array<IVariable>;
  procedures: Array<IFunction>;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}

export interface IReadContext {
  tokens: Array<IToken>;
  pos: number;
}

export class ObjectReader {
  static convert(content: string): string {
    const tokens = Tokenizer.tokenizer(content);
    const context: IReadContext = {
      tokens: tokens,
      pos: 0,
    };

    const appObject = this.readObject(context);
    return this.objectToString(appObject);
  }

  static objectToString(context: IObjectContext): string {
    const lines: Array<string> = [];
    const segmentNames = [
      "keys",
      "fieldgroups",
      "actions",
      "requestpage",
      "labels",
      "elements",
      "schema",
      "value",
    ];
    lines.push(context.header);

    const pad = _.padStart("", 4);

    if (context.properties.length > 0) {
      context.properties.forEach((property) => {
        lines.push(`${pad}${property}`);
      });
      lines.push("");
    }

    if (context.fields) {
      const fieldLines = FieldsReader.fieldsToString(context.fields);
      fieldLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    if (context.layout) {
      const layoutLines = LayoutReader.layoutToString(context.layout);
      layoutLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    if (context.actions) {
      const actionLines = ActionsReader.actionContainerToString(
        context.actions,
        4
      );
      actionLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    if (context.views) {
      const viewLines = ViewsReader.viewContainerToString(context.views, 4);
      viewLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    if (context.dataSet) {
      const dataSetLines = DataSetReader.dataSetToString(context.dataSet);
      dataSetLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    if (context.schema) {
      const schemaLines = schemaReader.schemaToString(context.schema);
      schemaLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    segmentNames.forEach((name) => {
      const segments = _.filter(
        context.segments,
        (segment) => segment.name === name
      );

      if (segments.length > 0) {
        segments.forEach((segment) => {
          const segmentBody = Helper.tokensToString(segment.tokens, {});
          lines.push(`${pad}${segmentBody}`);
        });

        lines.push("");
      }
    });

    if (context.triggers.length > 0) {
      lines.push("");
      context.triggers.forEach((trigger) => {
        const triggerLines = FunctionReader.functionToString(trigger, 4);
        triggerLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (context.variables.length > 0) {
      const variableLines = VariableReader.variablesToString(
        context.variables,
        4
      );
      variableLines.forEach((line) => lines.push(line));
      lines.push("");
    }

    if (context.procedures.length > 0) {      
      const procedures = _.sortBy(context.procedures, (item) => [item.weight]);
      procedures.forEach((procedure) => {
        const procedureLines = FunctionReader.functionToString(procedure, 4);
        procedureLines.forEach((line) => lines.push(line));
        lines.push("");
      });
    }

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(context.footer);
    return lines.join("\r\n");
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
          appObject.schema = schemaReader.readSchema(context);
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
