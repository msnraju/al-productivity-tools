import _ = require("lodash");
import { Helper } from "../helper";
import { ActionContainerWriter } from "./action-container-writer";
import { DataSetWriter } from "./dataset-writer";
import { FieldsContainerWriter } from "./fields-container-writer";
import { LayoutWriter } from "./layout-writer";
import { IObjectContext } from "../models/IObjectContext";
import { ViewContainerWriter } from "./view-container-writer";
import { VariableContainerWriter } from "./variable-container-writer";
import { SchemaWriter } from "./schema-writer";
import { ISegment } from "../models/ISegment";
import { IVariable } from "../models/IVariable";
import StringBuilder from "../models/string-builder";
import { ProcedureWriter } from "./procedure-writer";

export class ObjectWriter {
  static write(context: IObjectContext): string {
    const indentation = 4;
    return new StringBuilder()
      .write(context.header)
      .write(context.properties, indentation)
      .writeIfDefined(context.fields, (field) =>
        FieldsContainerWriter.write(field, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.layout, (layout) =>
        LayoutWriter.write(layout, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.actions, (container) =>
        ActionContainerWriter.write(container, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.views, (container) =>
        ViewContainerWriter.write(container, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.dataSet, (dataSet) =>
        DataSetWriter.write(dataSet, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.schema, (schema) =>
        SchemaWriter.write(schema, indentation)
      )
      .emptyLine()
      .write(this.writeSegments(context.segments, indentation))
      .emptyLine()
      .writeEach(context.triggers, (trigger) =>
        ProcedureWriter.write(trigger, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.variables, (variables) =>
        VariableContainerWriter.write(variables, indentation)
      )
      .emptyLine()
      .writeEach(context.procedures, (procedure) =>
        ProcedureWriter.write(procedure, indentation)
      )
      .popEmpty()
      .toString();
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

    const pad = Helper.pad(indentation);
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
}
