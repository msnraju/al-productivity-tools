import IToken from "../../../tokenizers/models/token.model";
import IALComponent from "./al-component.model";

export default interface IFieldGroup extends IALComponent {
  comments: string[];
  properties: string[];
  declaration: IToken[];
}
