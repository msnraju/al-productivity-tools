import { Helper } from "../helper";
import { ActionContainerWriter } from "./action-container-writer";
import { DataSetWriter } from "./dataset-writer";
import { FieldsWriter } from "./fields-writer";
import { FunctionWriter } from "./function-writer";
import { LayoutWriter } from "./layout-writer";
import { IObjectContext } from "../models/IObjectContext";
import { ViewContainerWriter } from "./view-container-writer";
import { VariableWriter } from "./variable-writer";
import { SchemaWriter } from "./schema-writer";
import _ = require("lodash");
import { IFieldsContainer } from "../models/IFieldsContainer";
import { ILayout } from "../models/ILayout";
import { ISegment } from "../models/ISegment";
import { IFunction } from "../models/IFunction";
import { IVariable } from "../models/IVariable";
import { ISchema } from "../models/ISchema";
import { IActionContainer } from "../models/IActionContainer";
import { IViewContainer } from "../models/IViewContainer";
import { IDataSet } from "../models/IDataSet";

export class ObjectWriter {
  static write(context: IObjectContext): string {
    const lines: string[] = [];
    const pad = Helper.pad(4);

    lines.push(context.header);
    lines.push(...this.writeProperties(context.properties, 4));
    if (context.fields) {
      lines.push(...this.writeFields(context.fields));
    }
    if (context.layout) {
      lines.push(...this.writeLayout(context.layout));
    }

    if (context.actions) {
      lines.push(...this.writeActions(context.actions, 4));
    }

    if (context.views) {
      lines.push(...this.writeViews(context.views, 4));
    }

    if (context.dataSet) {
      lines.push(...this.writeDataSet(context.dataSet, 4));
    }

    if (context.schema) {
      lines.push(...this.writeSchema(context.schema));
    }

    lines.push(...this.writeSegments(context.segments, 4));
    lines.push(...this.writeProcedures(context.triggers, 4));
    lines.push(...this.writeVariables(context.variables, 4));
    lines.push(...this.writeProcedures(context.procedures, 4));

    if (lines[lines.length - 1] === "") lines.pop();
    lines.push(context.footer);
    return lines.join("\r\n");
  }

  private static writeDataSet(
    dataSet: IDataSet,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!dataSet) return lines;
    lines.push(...DataSetWriter.write(dataSet));
    lines.push("");

    return lines;
  }

  private static writeViews(
    views: IViewContainer,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!views) return lines;
    lines.push(...ViewContainerWriter.write(views, indentation));
    lines.push("");

    return lines;
  }

  private static writeActions(
    actions: IActionContainer,
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!actions) return lines;

    lines.push(...ActionContainerWriter.write(actions, indentation));
    lines.push("");

    return lines;
  }

  private static writeSchema(schema: ISchema): string[] {
    const lines: string[] = [];
    if (!schema) return lines;

    lines.push(...SchemaWriter.write(schema));
    lines.push("");

    return lines;
  }

  private static writeVariables(
    variables: Array<IVariable>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!variables || variables.length > 0) return lines;

    lines.push(...VariableWriter.write(variables, indentation));
    lines.push("");

    return lines;
  }

  private static writeProcedures(
    procedures: Array<IFunction>,
    indentation: number
  ): string[] {
    const lines: string[] = [];

    if (!procedures || procedures.length === 0) return lines;

    const procedures2 = _.sortBy(procedures, (item) => [item.weight]);
    procedures2.forEach((procedure) => {
      lines.push(...FunctionWriter.write(procedure, indentation));
      lines.push("");
    });

    return lines;
  }

  private static writeSegments(
    segments: Array<ISegment>,
    indentation: number
  ): string[] {
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

    const lines: string[] = [];

    if (!segments || segments.length == 0) return lines;

    const pad = Helper.pad(4);
    segmentNames.forEach((name) => {
      const segments2 = _.filter(segments, (segment) => segment.name === name);

      if (segments2.length > 0) {
        segments2.forEach((segment) => {
          const segmentBody = Helper.tokensToString(segment.tokens, {});
          lines.push(`${pad}${segmentBody}`);
        });

        lines.push("");
      }
    });

    return lines;
  }

  private static writeLayout(layout: ILayout): string[] {
    const lines: string[] = [];

    if (!layout) return lines;

    lines.push(...LayoutWriter.write(layout));
    lines.push("");

    return lines;
  }

  private static writeFields(fields: IFieldsContainer): string[] {
    const lines: string[] = [];
    if (!fields) return lines;

    lines.push(...FieldsWriter.write(fields));
    lines.push("");

    return lines;
  }

  private static writeProperties(
    properties: string[],
    indentation: number
  ): string[] {
    const lines: string[] = [];
    if (!properties || properties.length == 0) return lines;

    const pad = Helper.pad(indentation);
    properties.forEach((property) => {
      lines.push(`${pad}${property}`);
    });
    lines.push("");

    return lines;
  }
}
