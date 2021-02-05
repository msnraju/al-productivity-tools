import IField from "./field.model";

export default interface IFieldsContainer {
  fields: IField[];
  postLabelComments: string[];
  comments: string[];
}