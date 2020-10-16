import { IDataSet } from "../models/IDataSet";
import { IDataItem } from "../models/IDataItem";
import { FunctionWriter } from "./function-writer";
import { Helper } from "../helper";

export class DataSetWriter {
    static dataSetToString(dataset: IDataSet): Array<string> {
        const lines: Array<string> = [];
        const pad = Helper.pad(4);
    
        lines.push(`${pad}dataset`);
        if (dataset.postLabelComments.length > 0) {
          dataset.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
        }
        lines.push(`${pad}{`);
        if (dataset.comments.length > 0) {
          dataset.comments.forEach((line) => lines.push(`${pad}${line}`));
        }
    
        dataset.dataItems.forEach((dataItem) => {
          const dataItemLines = this.dataItemToString(dataItem, 8);
          dataItemLines.forEach((line) => lines.push(line));
        });
    
        lines.push(`${pad}}`);
        return lines;
      }
    
      static dataItemToString(
        dataItem: IDataItem,
        indentation: number
      ): Array<string> {
        const lines: Array<string> = [];
        const pad = Helper.pad(indentation);
        const pad2 = Helper.pad(indentation + 4);
        
        lines.push(`${pad}${dataItem.header}`);
        dataItem.comments.forEach((line) => lines.push(`${pad}${line}`));
        lines.push(`${pad}{`);
    
        this.writeProperties(dataItem, lines, pad2);
        this.writeItems(dataItem, lines, indentation);
        this.writeTriggers(dataItem, lines, indentation);
    
        if (lines[lines.length - 1] === "") {
          lines.pop();
        }
    
        lines.push(`${pad}}`);
        return lines;
      }
    
      private static writeItems(
        dataItem: IDataItem,
        lines: string[],
        indentation: number
      ) {
        if (!dataItem.dataItems) return;
    
        dataItem.dataItems.forEach((dataItem) => {
          const controlLines = this.dataItemToString(dataItem, indentation + 4);
          controlLines.forEach((line) => lines.push(line));
        });
      }
    
      private static writeTriggers(
        dataItem: IDataItem,
        lines: string[],
        indentation: number
      ) {
        if (!dataItem.triggers) return;
    
        dataItem.triggers.forEach((trigger) => {
          const triggerLines = FunctionWriter.functionToString(
            trigger,
            indentation + 4
          );
          triggerLines.forEach((line) => lines.push(line));
          lines.push("");
        });
      }
    
      private static writeProperties(
        dataItem: IDataItem,
        lines: string[],
        indentation: string
      ) {
        if (!dataItem.properties) return;
    
        dataItem.properties.forEach((property) => {
          lines.push(`${indentation}${property}`);
        });
    
        lines.push("");
      }    
}