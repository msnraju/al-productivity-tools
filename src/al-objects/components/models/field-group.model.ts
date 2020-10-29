import IToken from "../../models/IToken";
import IALComponent from "./al-component.model";

export default interface IFieldGroup extends IALComponent {
  comments: string[];
  properties: string[];
  declaration: IToken[];
}
