import ICodeAnalyzerRule from "./models/code-analyzer-rule.model";

const UICopRules: ICodeAnalyzerRule[] = [
  {
    id: "AW0001",
    title:
      "The Web client does not support displaying the Request page of XMLPorts.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0002",
    title:
      "The Web client does not support displaying both Actions and Fields in Cue Groups. Only Fields will be displayed.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0003",
    title:
      "The Web client does not support displaying Repeater controls containing Parts.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0004",
    title: "A Blob cannot be used as a source expression for a page field.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0005",
    title: "Actions should use the Image property.",
    category: "WebClient",
    defaultSeverity: "Info",
  },
  {
    id: "AW0006",
    title:
      "Pages and reports should use the UsageCategory and ApplicationArea properties to be searchable.",
    category: "WebClient",
    defaultSeverity: "Info",
  },
  {
    id: "AW0007",
    title:
      "The Web client does not support displaying Repeater controls that contain FlowFilter fields.",
    category: "WebClient",
    defaultSeverity: "Error",
  },
  {
    id: "AW0008",
    title:
      "The Web client does not support displaying Repeater controls in pages of type Card, Document, and ListPlus.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0009",
    title:
      "Using a Blob with subtype Bitmap on a page field is deprecated. Instead use the Media/MediaSet data types.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0010",
    title:
      "A Repeater control used on a List page must be defined at the beginning of the area(Content) section.",
    category: "WebClient",
    defaultSeverity: "Warning",
  },
  {
    id: "AW0011",
    title:
      'Add PromotedOnly="true" to some or all promoted actions to avoid identical actions from appearing in both the promoted and default sections of the command bar.',
    category: "WebClient",
    defaultSeverity: "Info",
  },
];

export default UICopRules;
