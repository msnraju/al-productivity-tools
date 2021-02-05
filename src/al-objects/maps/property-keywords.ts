import IKeyValue from "../../helpers/models/key-value.model";

class Properties implements IKeyValue {
  [prop: string]: string;

  field = "field";
  filter = "filter";
  const = "const";
  where = "where";
  sorting = "sorting";
  not = "not";
  if = "if";
  else = "else";
  then = "then";
  sum = "sum";
  min = "min";
  max = "max";
  count = "count";
  average = "average";
  avg = "avg";
  ascending = "ascending";
  descending = "descending";
}

const PROPERTY_KEYWORDS = new Properties();
export default PROPERTY_KEYWORDS;
