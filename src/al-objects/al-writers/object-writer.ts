import _ = require("lodash");
import StringHelper from "../string-helper";
import ActionContainerWriter from "./action-container-writer";
import DataSetWriter from "./dataset-writer";
import FieldsContainerWriter from "./fields-container-writer";
import KeysContainerWriter from "./keys-container-writer";
import LayoutWriter from "./layout-writer";
import IObjectContext from "../models/IObjectContext";
import ViewContainerWriter from "./view-container-writer";
import VariableContainerWriter from "./variable-container-writer";
import SchemaWriter from "./schema-writer";
import ISegment from "../models/ISegment";
import ProcedureWriter from "./procedure-writer";
import StringBuilder from "../models/string-builder";
import FieldGroupContainerWriter from "./field-group-container-writer";

export default class ObjectWriter {
  static write(context: IObjectContext): string {
    return new StringBuilder()
      .write(context.header)
      .write(this.writeBody(context, 4))
      .write("}")
      .toString();
  }

  private static writeBody(
    context: IObjectContext,
    indentation: number
  ): string {
    return new StringBuilder()
      .write(context.properties, indentation)
      .emptyLine()
      .writeIfDefined(context.fields, (container) =>
        FieldsContainerWriter.write(container, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.keys, (container) =>
        KeysContainerWriter.write(container, indentation)
      )
      .emptyLine()
      .writeIfDefined(context.fieldGroups, (container) =>
        FieldGroupContainerWriter.write(container, indentation)
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
  ): string {
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

    if (!segments || segments.length == 0) return "";
    segments = _.sortBy(segments, (seg) => segmentNames.indexOf(seg.name));

    const writer = new StringBuilder();
    segments.forEach((segment) => {
      writer.write(StringHelper.tokensToString(segment.tokens, {}), indentation);
      writer.emptyLine();
    });

    writer.popEmpty();
    return writer.toString();
  }
}
