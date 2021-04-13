import IToken from "../../tokenizers/models/token.model";
import IFieldGroup from "./models/field-group.model";
import IProperty from "./models/property.model";

export default class FieldGroup implements IFieldGroup {
  keyword: string;
  comments: string[];
  header: string;
  properties: IProperty[];
  declaration: IToken[];

  constructor() {
    this.comments = [];
    this.keyword = "";
    this.header = "";
    this.properties = [];
    this.declaration = [];
  }
}
