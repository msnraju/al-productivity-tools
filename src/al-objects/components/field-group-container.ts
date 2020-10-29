import IFieldGroup from "./models/field-group.model";
import IFieldGroupList from "./models/field-group-list.model";

export default class FieldGroupContainer implements IFieldGroupList {
  keyword: string;
  fieldGroups: IFieldGroup[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.keyword = "";
    this.comments = [];
    this.postLabelComments = [];
    this.fieldGroups = [];
  }
}
