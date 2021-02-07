import IVariable from "../../models/IVariable";

export default interface IVarSection {
  protected: boolean;
  variables: IVariable[];
}
