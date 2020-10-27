import { IField } from "../models/IField";
import { IFieldsContainer } from "../models/IFieldsContainer";

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