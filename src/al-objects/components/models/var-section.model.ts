import IVariable from "../../models/variable.model";

export default interface IVarSection {
  protected: boolean;
  variables: IVariable[];
}
