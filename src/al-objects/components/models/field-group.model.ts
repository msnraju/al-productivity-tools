import IToken from "../../../tokenizers/models/token.model";
import IALComponent from "./al-component.model";
import IProperty from "./property.model";

export default interface IFieldGroup extends IALComponent {
  comments: string[];
  properties: IProperty[];
  declaration: IToken[];
}
