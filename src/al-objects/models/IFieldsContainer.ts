import IField from "./IField";

export default interface IFieldsContainer {
  fields: IField[];
  postLabelComments: string[];
  comments: string[];
}