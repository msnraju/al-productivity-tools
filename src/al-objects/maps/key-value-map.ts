import IKeyValue from "../../helpers/models/key-value.model";

/* spell-checker: disable */
export default class KeyValueMap implements IKeyValue {
  [prop: string]: string;
}
