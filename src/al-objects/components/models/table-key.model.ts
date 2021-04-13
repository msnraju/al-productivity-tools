import IProperty from "./property.model";

export default interface ITableKey {
  comments: string[];
  header: string;
  properties: IProperty[];
}
