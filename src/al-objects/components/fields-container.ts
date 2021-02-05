import IField from "./models/field.model";
import IFieldsContainer from "./models/fields-container.model";

export default class FieldsContainer implements IFieldsContainer {
  fields: IField[];
  postLabelComments: string[];
  comments: string[];

  constructor() {
    this.fields = [];
    this.postLabelComments = [];
    this.comments = [];
  }
}