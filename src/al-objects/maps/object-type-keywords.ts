import IKeyValue from "../../helpers/key-value";

class ObjectTypeKeyWords implements IKeyValue {
  [prop: string]: string;

  table = "table";
  page = "page";
  codeunit = "codeunit";
  report = "report";
  query = "query";
  xmlport = "xmlport";
  enum = "enum";
  interface = "interface";
  controladdin = "controladdin";
  tableextension = "tableextension";
  pageextension = "pageextension";
  enumextension = "enumextension";
}

const OBJECT_TYPE_KEYWORDS = new ObjectTypeKeyWords();
export default OBJECT_TYPE_KEYWORDS;
