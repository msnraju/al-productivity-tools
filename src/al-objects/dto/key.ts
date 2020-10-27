import IKey from "../models/IKey";

export default class Key implements IKey {
  comments: string[];
  header: string;
  properties: string[];

  constructor() {
    this.header = "";
    this.comments = [];
    this.properties = [];
  }
}
