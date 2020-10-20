import { IField } from "./IField";

export interface IFieldsContainer {
  fields: Array<IField>;
  postLabelComments: string[];
  comments: string[];
}