import { IVariable } from "../models/IVariable";
import { IProcedure } from "../models/IProcedure";
import { IFieldsContainer } from "../models/IFieldsContainer";
import { ILayout } from "../models/ILayout";
import { IActionContainer } from "../models/IActionContainer";
import { IDataSet } from "../models/IDataSet";
import { ISchema } from "../models/ISchema";
import { IViewContainer } from "../models/IViewContainer";
import { ISegment } from "../models/ISegment";
import { IObjectContext } from "../models/IObjectContext";

export default class ObjectContext implements IObjectContext {
  views?: IViewContainer | undefined;
  schema?: ISchema | undefined;
  dataSet?: IDataSet | undefined;
  actions?: IActionContainer | undefined;
  layout?: ILayout | undefined;
  header: string;
  footer: string;
  fields?: IFieldsContainer | undefined;
  variables: IVariable[];
  procedures: IProcedure[];
  triggers: IProcedure[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.header = "";
    this.footer = "";
    this.variables = [];
    this.procedures = [];
    this.triggers = [];
    this.segments = [];
    this.properties = [];
  }
}
