import { IField } from "./IField";

export interface IFieldsContainer {
  fields: Array<IField>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}
