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
import IProperty from "./property.model";
import IAppObjectDeclaration from "./app-object-declaration.model";
import IRequestPage from "./request-page.model";

export default interface IObjectContext {
  declaration: IAppObjectDeclaration;
  keys?: IKeysContainer;
  fieldGroups?: IFieldGroupList;
  views?: IViewContainer;
  schema?: ISchema;
  requestPage?: IRequestPage;
  dataSet?: IDataSet;
  actionsContainer?: IActionContainer;
  layout?: IPageLayout;
  header: string;
  footer: string;
  fields?: IFieldsContainer;
  variables?: IVarSection;
  procedures: IMethodDeclaration[];
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];
}
