import IMethodDeclaration from "./models/method-declaration.model";
import IFieldsContainer from "./models/IFieldsContainer";
import IPageLayout from "./models/page-layout.model";
import IActionContainer from "./models/IActionContainer";
import IDataSet from "./models/IDataSet";
import ISchema from "./models/ISchema";
import IViewContainer from "./models/IViewContainer";
import ISegment from "./models/ISegment";
import IObjectContext from "./models/IObjectContext";
import IVarSection from "./models/var-section.model";

export default class ObjectContext implements IObjectContext {
  views?: IViewContainer | undefined;
  schema?: ISchema | undefined;
  dataSet?: IDataSet | undefined;
  actions?: IActionContainer | undefined;
  layout?: IPageLayout | undefined;
  header: string;
  footer: string;
  fields?: IFieldsContainer | undefined;
  variables?: IVarSection;
  procedures: IMethodDeclaration[];
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.header = "";
    this.footer = "";
    this.procedures = [];
    this.triggers = [];
    this.segments = [];
    this.properties = [];
  }
}
