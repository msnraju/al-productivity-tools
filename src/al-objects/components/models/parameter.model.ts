import IVariable from "../../models/variable.model";

export default interface IParameter extends IVariable {
  ref: boolean;
}
