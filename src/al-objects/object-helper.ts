import IControl from "./components/models/control.model";
import IAction from "./components/models/action.model";
import IObjectContext from "./components/models/object-context.model";
import {
  AppSymbols,
  Field,
  Page,
  Table,
  TableExtension,
} from "../symbol-references";
import StringHelper from "../helpers/string-helper";
import { table } from "console";
import { isNumber } from "lodash";

export class ObjectHelper {
  static findInActions(actions: IAction[], name: string): IAction | undefined {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.type.toLowerCase() === "action" && action.name === name) {
        return action;
      }

      if (action.actions && action.actions.length > 0) {
        const actionFound = ObjectHelper.findInActions(action.actions, name);
        if (actionFound) {
          return actionFound;
        }
      }
    }
  }

  static findInControls(
    controls: IControl[],
    name: string
  ): IControl | undefined {
    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      if (control.type.toLowerCase() === "field" && control.name === name) {
        return control;
      }

      if (control.controls && control.controls.length > 0) {
        const controlFound = ObjectHelper.findInControls(
          control.controls,
          name
        );
        if (controlFound) {
          return controlFound;
        }
      }
    }
  }

  static fixSourceExpr(
    sourceExpr: string,
    appObject: IObjectContext,
    symbols: AppSymbols[]
  ): string {
    const variable = appObject.variables?.variables.find(
      (p) => p.name.toLowerCase() === sourceExpr.toLowerCase()
    );
    if (variable) {
      return sourceExpr;
    }

    const pages: Page[] = [];
    const tables: Table[] = [];
    const tableExtensions: TableExtension[] = [];
    symbols.forEach((s) => {
      pages.push(...s.Pages);
      tables.push(...s.Tables);
      tableExtensions.push(...s.TableExtensions);
    });

    let sourceTable: string = "";
    if (/PageExtension/i.test(appObject.declaration.type)) {
      const baseObject = StringHelper.removeQuotes(
        appObject.declaration.baseObject
      );

      const page = pages.find((p) => p.Name === baseObject);
      sourceTable =
        page?.Properties.find((p) => /SourceTable/i.test(p.Name))?.Value || "";
    } else {
      const page = pages.find((p) => p.Id === Number(appObject.declaration.id));
      sourceTable =
        page?.Properties.find((p) => /SourceTable/i.test(p.Name))?.Value || "";
    }

    if (!sourceTable) {
      return sourceExpr;
    }

    const table = /[0-9]*/.test(sourceTable)
      ? tables.find((t) => t.Id === Number(sourceTable))
      : tables.find((t) => t.Name === sourceTable);

    if (!table) {
      return sourceExpr;
    }

    const fields: Field[] = [];
    fields.push(...table.Fields);
    tableExtensions
      .filter((p) => p.TargetObject === table.Name)
      .forEach((p) => fields.push(...p.Fields));

    const sourceExpr2 = StringHelper.removeQuotes(sourceExpr).toLowerCase();
    const field = fields.find(
      (p) => p.Name.toLowerCase() === sourceExpr2.toLowerCase()
    );

    if (field) {
      if (/[^0-9A-Z_]/i.test(field.Name)) {
        return `Rec."${field.Name}"`;
      } else {
        return `Rec.${field.Name}`;
      }
    }

    return sourceExpr;
  }

  private static findTable(tables: Table[], name: string) {
    const table = tables.find((p) => p.Name === name);
    return table;
  }
}
