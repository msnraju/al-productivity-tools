import IKeyValue from "../helpers/key-value";

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
    const objectTypes = [
      "record",
      "codeunit",
      "report",
      "page",
      "testpage",
      "query",
      "xmlport",
      "enum",
    ];

    return objectTypes.indexOf(type.toLowerCase()) !== -1;
  }

  static getALObjectSuffix(name: string): string {
    return this.ALFileSuffix[name.toLowerCase()];
  }
}
