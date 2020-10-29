import ISegment from "./models/ISegment";
import IMethodDeclaration from "./models/method-declaration.model";
import IActionContainer from "./models/IActionContainer";
import IControl from "./models/IControl";

export default class Control implements IControl {
  container?: IActionContainer | undefined;
  controls: IControl[];
  comments: string[];
  header: string;
  triggers: IMethodDeclaration[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.header = "";
    this.controls = [];
    this.triggers = [];
    this.segments = [];
    this.comments = [];
    this.properties = [];
  }
}