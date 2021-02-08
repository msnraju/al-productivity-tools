import ITableKey from "./models/table-key.model";

export default class Key implements ITableKey {
  comments: string[];
  header: string;
  properties: string[];

  constructor() {
    this.header = "";
    this.comments = [];
    this.properties = [];
  }
}
