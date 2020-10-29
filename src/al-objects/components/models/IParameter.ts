import IVariable from "../../models/IVariable";

export default interface IParameter extends IVariable {
  ref: boolean;
}
