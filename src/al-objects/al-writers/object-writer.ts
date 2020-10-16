import { Helper } from "../helper";
import { ActionContainerWriter } from "./action-container-writer";
import { DataSetWriter } from "./dataset-writer";
import { FieldsWriter } from "./fields-writer";
import { FunctionWriter } from "./function-writer";
import { LayoutWriter } from "./layout-writer";
import { IObjectContext } from "../models/IObjectContext";
import { ViewsWriter } from "./views-writer";
import { VariableWriter } from "./variable-writer";
import { SchemaWriter } from "./schema-writer";
import _ = require("lodash");

export class ObjectWriter {
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
    
        const pad = Helper.pad(4);
    
        if (context.properties.length > 0) {
          context.properties.forEach((property) => {
            lines.push(`${pad}${property}`);
          });
          lines.push("");
        }
    
        if (context.fields) {
          const fieldLines = FieldsWriter.fieldsToString(context.fields);
          fieldLines.forEach((line) => lines.push(line));
          lines.push("");
        }
    
        if (context.layout) {
          const layoutLines = LayoutWriter.layoutToString(context.layout);
          layoutLines.forEach((line) => lines.push(line));
          lines.push("");
        }
    
        if (context.actions) {
          const actionLines = ActionContainerWriter.write(
            context.actions,
            4
          );
          actionLines.forEach((line) => lines.push(line));
          lines.push("");
        }
    
        if (context.views) {
          const viewLines = ViewsWriter.viewContainerToString(context.views, 4);
          viewLines.forEach((line) => lines.push(line));
          lines.push("");
        }
    
        if (context.dataSet) {
          const dataSetLines = DataSetWriter.dataSetToString(context.dataSet);
          dataSetLines.forEach((line) => lines.push(line));
          lines.push("");
        }
    
        if (context.schema) {
          const schemaLines = SchemaWriter.schemaToString(context.schema);
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
          context.triggers.forEach((trigger) => {
            const triggerLines = FunctionWriter.functionToString(trigger, 4);
            triggerLines.forEach((line) => lines.push(line));
            lines.push("");
          });
        }
    
        if (context.variables.length > 0) {
          const variableLines = VariableWriter.variablesToString(
            context.variables,
            4
          );
          variableLines.forEach((line) => lines.push(line));
          lines.push("");
        }
    
        if (context.procedures.length > 0) {      
          const procedures = _.sortBy(context.procedures, (item) => [item.weight]);
          procedures.forEach((procedure) => {
            const procedureLines = FunctionWriter.functionToString(procedure, 4);
            procedureLines.forEach((line) => lines.push(line));
            lines.push("");
          });
        }
    
        if (lines[lines.length - 1] === "") lines.pop();
        lines.push(context.footer);
        return lines.join("\r\n");
      }    
}