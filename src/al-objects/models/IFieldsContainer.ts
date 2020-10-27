import { IField } from "./IField";

export interface IFieldsContainer {
  fields: IField[];
  postLabelComments: string[];
  comments: string[];
}