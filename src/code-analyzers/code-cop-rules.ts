import ICodeAnalyzerRule from "./models/code-analyzer-rule.model";

const CodeCopRules: ICodeAnalyzerRule[] = [
  {
    id: "AA0001",
    title:
      "There must be exactly one space character on each side of a binary operator such as := + - AND OR =.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0002",
    title: "There must be no space character.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0003",
    title:
      "There must be exactly one space character between the NOT operator and its argument.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0005",
    title: "Only use BEGIN..END to enclose compound statements.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0008",
    title:
      "Function calls should have parenthesis even if they do not have any parameters.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0013",
    title:
      "When BEGIN follows THEN, ELSE, DO, it should be on the same line, preceded by one space character.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0018",
    title:
      "The END, IF, REPEAT, UNTIL, FOR, WHILE, and CASE statement should always start a line.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0021",
    title: "Variable declarations should be ordered by type.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0022",
    title: "Substitute the IF THEN ELSE structure with a CASE.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0040",
    title: "Avoid using nested WITH statements.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0072",
    title:
      "The name of variables and parameters must be suffixed with the type or object name.",
    category: "Readability",
    defaultSeverity: "Info",
  },
  {
    id: "AA0073",
    title: "The name of temporary variable must be prefixed with Temp.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0074",
    title: "TextConst and Label variable names should have an approved suffix.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0087",
    title: "Lowering permissions should only be used in tests",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0100",
    title: "Do not have identifiers with quotes in the name.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0101",
    title: "Use camel case property values in pages of type API.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0102",
    title: "Use camel case name for field controls in pages of type API.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0103",
    title: "Use camel case property values in queries of type API.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0104",
    title: "Use camel case name for column controls in queries of type API.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0105",
    title: "PagePart controls must not refer to parent pages.",
    category: "Design",
    defaultSeverity: "Error",
  },
  {
    id: "AA0106",
    title: "A page of type API can only refer to the same subpage once.",
    category: "Design",
    defaultSeverity: "Error",
  },
  {
    id: "AA0131",
    title: "String parameters must match placeholders.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0136",
    title: "Do not write code that will never be hit.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0137",
    title: "Do not declare variables that are unused.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0139",
    title: "Do not assign a text to a target with smaller size.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0150",
    title:
      "Do not declare parameters by reference if their values are never changed.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0161",
    title: "Only use AssertError in Test Codeunits.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0175",
    title: "Only find record if you need to use it.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0181",
    title:
      "The FindSet() or Find() methods must be used only in connection with the Next() method.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0189",
    title: "Only use a correct values of ApplicationArea.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0194",
    title: "Only write actions that have an effect.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0198",
    title: "Do not use identical names for local and global variables.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0199",
    title: "Use only a correct order for ApplicationArea.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0200",
    title:
      "When ApplicationArea is set to 'All', no other values for ApplicationArea should be specified.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0201",
    title:
      "When ApplicationArea is set to 'Basic', you must also specify 'Suite'.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0462",
    title:
      "The CalcDate should only be used with DataFormula variables. Alternatively the string should be enclosed using the <> symbols.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0202",
    title:
      "To avoid confusion, do not give local variables the same name as fields, methods or actions in the same scope.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0203",
    title:
      "To avoid confusion, do not give methods the same name as fields or actions in the same scope.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0204",
    title:
      "To avoid confusion, do not give global variables the same name as fields, methods or actions in the same scope.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0205",
    title: "Variables must be initialized before usage.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0206",
    title: "The value assigned to a variable must be used.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0207",
    title: "The EventSubscriber method must be local.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0210",
    title: "Avoid non-indexed fields into filtering.",
    category: "Design",
    defaultSeverity: "Info",
  },
  {
    id: "AA0211",
    title:
      "Avoids a runtime error from using CalcFields on a field that is not a FlowField or a field of type Blob.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0213",
    title:
      "Obsoleted object must have a state 'Pending' or 'Removed' and a justification specifying why this field is being obsoleted.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0214",
    title: "The local record should be modified before saving to the database.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0215",
    title: "Follow the style guide about the best practices for naming.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0216",
    title:
      "Use a text constant for passing user messages and errors without concatenations.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0217",
    title: "Use a text constant or label for format string in StrSubstNo.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0218",
    title:
      "You must write a tooltip in the Tooltip property for all controls of type Action and Field that exist on page objects.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0219",
    title: "The Tooltip property of Fields must start with 'Specifies'.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0220",
    title: "The value of the Tooltip property of Fields must be filled.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0221",
    title:
      "You must specify a OptionCaption property for all fields which source expressions is not a table field.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0222",
    title: "SIFT index should not be used on primary or unique key.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0223",
    title:
      "The value of the OptionCaption property of Fields must be filled in.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0224",
    title:
      "The count of option captions specified in the OptionCaption property is wrong.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0225",
    title:
      "You must specify a caption in the Caption property for Fields that exist on page objects.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0226",
    title: "The value of the Caption property of Fields must be filled in.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0227",
    title: "Optional return value should not be omitted in upgrade codeunits.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0228",
    title: "The local method must be used; otherwise removed.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0230",
    title: "Version should not be specified for internal assemblies.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0231",
    title:
      "StrSubstNo or string concatenation must not be used as a parameter in the Error method.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0232",
    title: "The FlowField of a table should be indexed.",
    category: "Design",
    defaultSeverity: "Info",
  },
  {
    id: "AA0233",
    title: "Use Get(), FindFirst() and FindLast() without Next() method.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0235",
    title:
      "When using 'OnInstallPerCompany' you should also add 'Company - Initialize'::'OnCompanyInitialize' event subscriber.",
    category: "Design",
    defaultSeverity: "Info",
  },
  {
    id: "AA0237",
    title:
      "The name of non-temporary variables must not be prefixed with Temp.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0240",
    title:
      "Email and Phone No must not be present in any part of the source code.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0241",
    title: "Use all lowercase letters for reserved language keywords.",
    category: "Readability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0448",
    title:
      "You must use the FieldCaption method instead of the FieldName method and TableCaption method instead of TableName method.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0470",
    title: "Placeholders should have a comment explaining their content.",
    category: "Localizability",
    defaultSeverity: "Warning",
  },
  {
    id: "AA0242",
    title: "Limit JIT loads by selecting all fields for load.",
    category: "Design",
    defaultSeverity: "Warning",
  },
];

export default CodeCopRules;
