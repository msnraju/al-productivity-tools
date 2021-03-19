import _ = require("lodash");
import ActionContainerWriter from "./action-container-writer";
import DataSetWriter from "./dataset-writer";
import FieldsContainerWriter from "./fields-container-writer";
import KeysContainerWriter from "./keys-container-writer";
import PageLayoutWriter from "./page-layout-writer";
import IObjectContext from "../components/models/object-context.model";
import ViewContainerWriter from "./view-container-writer";
import VarSectionWriter from "./var-section-writer";
import SchemaWriter from "./schema-writer";
import ISegment from "../components/models/segment.model";
import MethodDeclarationWriter from "./method-declaration-writer";
import StringBuilder from "../../helpers/string-builder";
import FieldGroupContainerWriter from "./field-group-container-writer";
import TokenReader from "../../tokenizers/token-reader";
import IFormatSetting from "../../helpers/models/format-settings.model";
import MethodsWriter from "./methods-writer";
import ICodeIndex from "../models/code-index.model";

export default class ObjectWriter {
  static write(
    context: IObjectContext,
    formatSetting: IFormatSetting,
    codeIndex: ICodeIndex
  ): string {
    return new StringBuilder()
      .write(context.header)
      .write(this.writeBody(context, formatSetting, 4, codeIndex))
      .write("}")
      .toString();
  }

  private static writeBody(
    context: IObjectContext,
    formatSetting: IFormatSetting,
    indentation: number,
    codeIndex: ICodeIndex
  ): string {
    return (
      new StringBuilder()
        .write(context.properties.map(p => p.property), indentation)
        .emptyLine()
        .writeIfDefined(context.fields, (container) =>
          FieldsContainerWriter.write(container, formatSetting, indentation)
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
          PageLayoutWriter.write(layout, formatSetting, indentation)
        )
        .emptyLine()
        .writeIfDefined(context.actionsContainer, (container) =>
          ActionContainerWriter.write(container, formatSetting, indentation)
        )
        .emptyLine()
        .writeIfDefined(context.views, (container) =>
          ViewContainerWriter.write(container, indentation)
        )
        .emptyLine()
        .writeIfDefined(context.dataSet, (dataSet) =>
          DataSetWriter.write(dataSet, formatSetting, indentation)
        )
        .emptyLine()
        .writeIfDefined(context.schema, (schema) =>
          SchemaWriter.write(schema, formatSetting, indentation)
        )
        .emptyLine()
        .write(this.writeSegments(context.segments, indentation))
        .emptyLine()
        .writeEach(context.triggers, (trigger) =>
          MethodDeclarationWriter.write(trigger, formatSetting, indentation)
        )
        .emptyLine()
        .writeIfDefined(context.variables, (variables) =>
          VarSectionWriter.writeGlobalVariables(
            variables,
            formatSetting,
            indentation,
            codeIndex
          )
        )
        .emptyLine()
        .write(
          MethodsWriter.write(context.procedures, formatSetting, indentation)
        )
        // .writeEach(context.procedures, (procedure) =>
        //   MethodDeclarationWriter.write(procedure, formatSetting, indentation)
        // )
        .popEmpty()
        .toString()
    );
  }

  private static writeSegments(
    segments: Array<ISegment>,
    indentation: number
  ): string {
    const segmentNames = ["requestpage", "labels", "elements", "value"];

    if (!segments || segments.length == 0) return "";
    segments = _.sortBy(segments, (seg) => segmentNames.indexOf(seg.name));

    const writer = new StringBuilder();
    segments.forEach((segment) => {
      writer.write(TokenReader.tokensToString(segment.tokens, {}), indentation);
      writer.emptyLine();
    });

    writer.popEmpty();
    return writer.toString();
  }
}
