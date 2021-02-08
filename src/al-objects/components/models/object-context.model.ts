import IVariable from "../../models/variable.model";
import IMethodDeclaration from "./method-declaration.model";
import IFieldsContainer from "./fields-container.model";
import IPageLayout from "./page-layout.model";
import IActionContainer from "./action-container.model";
import IDataSet from "./data-set.model";
import ISchema from "./schema.model";
import IViewContainer from "./view-container.model";
import ISegment from "./segment.model";
import IKeysContainer from "./keys-container.model";
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
