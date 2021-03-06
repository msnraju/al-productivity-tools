import IMethodDeclaration from "./models/method-declaration.model";
import IFieldsContainer from "./models/fields-container.model";
import IPageLayout from "./models/page-layout.model";
import IActionContainer from "./models/action-container.model";
import IDataSet from "./models/data-set.model";
import ISchema from "./models/schema.model";
import IViewContainer from "./models/view-container.model";
import ISegment from "./models/segment.model";
import IObjectContext from "./models/object-context.model";
import IVarSection from "./models/var-section.model";
import IProperty from "./models/property.model";
import IAppObjectDeclaration from "./models/app-object-declaration.model";
import AppObjectDeclaration from "./app-object-declaration";

export default class ObjectContext implements IObjectContext {
  views?: IViewContainer | undefined;
  schema?: ISchema | undefined;
  dataSet?: IDataSet | undefined;
  actionsContainer?: IActionContainer | undefined;
  layout?: IPageLayout | undefined;
  header: string;
  footer: string;
  fields?: IFieldsContainer | undefined;
  variables?: IVarSection;
  procedures: IMethodDeclaration[];
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: IProperty[];
  declaration: IAppObjectDeclaration;

  constructor() {
    this.header = "";
    this.footer = "";
    this.procedures = [];
    this.triggers = [];
    this.segments = [];
    this.properties = [];
    this.declaration = new AppObjectDeclaration();
  }
}
