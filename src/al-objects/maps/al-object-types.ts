import { Collection } from "../../helpers/collection";
import IKeyValue from "../../helpers/models/key-value.model";

export default class ALObjectTypes {
  private static ALFileSuffix: IKeyValue = {
    table: "Table",
    page: "Page",
    codeunit: "Codeunit",
    report: "Report",
    query: "Query",
    xmlport: "XmlPort",
    enum: "Enum",
    enumextension: "EnumExt",
    tableextension: "TableExt",
    pageextension: "PageExt",
    controladdin: "ControlAddIn",
    interface: "Interface",
  };

  static isALObjectType(type: string): boolean {
    const objectTypes = new Collection([
      "record",
      "codeunit",
      "report",
      "page",
      "testpage",
      "query",
      "xmlport",
      "enum",
    ]);

    return objectTypes.hasItem(type.toLowerCase());
  }

  static getALFileSuffix(name: string): string {
    return this.ALFileSuffix[name.toLowerCase()];
  }
}
