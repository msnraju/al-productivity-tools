import IFieldGroup from "../models/IFieldGroup";
import IFieldGroupContainer from "../models/IFieldGroupContainer";

export default class FieldGroupContainer implements IFieldGroupContainer {
    fieldGroups: IFieldGroup[];
    postLabelComments: string[];
    comments: string[];

  constructor() {
    this.comments = [];
    this.postLabelComments = [];
    this.fieldGroups = [];
  }
}
