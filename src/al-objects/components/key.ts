import IProperty from "./models/property.model";
import ITableKey from "./models/table-key.model";

export default class Key implements ITableKey {
  comments: string[];
  header: string;
  properties: IProperty[];

  constructor() {
    this.header = "";
    this.comments = [];
    this.properties = [];
  }
}
