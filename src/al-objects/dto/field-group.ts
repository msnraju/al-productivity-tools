import IFieldGroup from "../models/IFieldGroup";

export default class FieldGroup implements IFieldGroup {
  comments: string[];
  header: string;
  properties: string[];

  constructor() {
    this.comments = [];
    this.header = "";
    this.properties = [];
  }
}
