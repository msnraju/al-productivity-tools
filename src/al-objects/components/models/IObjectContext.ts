import IVariable from "../../models/IVariable";
import IMethodDeclaration from "./method-declaration.model";
import IFieldsContainer from "./IFieldsContainer";
import IPageLayout from "./page-layout.model";
import IActionContainer from "./IActionContainer";
import IDataSet from "./IDataSet";
import ISchema from "./ISchema";
import IViewContainer from "./IViewContainer";
import ISegment from "./ISegment";
import IKeysContainer from "./IKeysContainer";
import IFieldGroupList from "./field-group-list.model";
import IVarSection from "./var-section.model";

export default interface IObjectContext {
  keys?: IKeysContainer;
  fieldGroups?: IFieldGroupList;
  views?: IViewContainer;
  schema?: ISchema;
  dataSet?: IDataSet;
  actions?: IActionContainer;
  layout?: IPageLayout;
  header: string;
  footer: string;
  fields?: IFieldsContainer;
  variables?: IVarSection;
  procedures: Array<IMethodDeclaration>;
  triggers: Array<IMethodDeclaration>;
  segments: Array<ISegment>;
  properties: string[];
}