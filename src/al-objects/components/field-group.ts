import IToken from "../models/IToken";
import IFieldGroup from "./models/field-group.model";

export default class FieldGroup implements IFieldGroup {
  keyword: string;
  comments: string[];
  header: string;
  properties: string[];
  declaration: IToken[];

  constructor() {
    this.comments = [];
    this.keyword = "";
    this.header = "";
    this.properties = [];
    this.declaration = [];
  }
}
