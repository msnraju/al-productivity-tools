import ICodeAnalyzerRule from "./models/code-analyzer-rule.model";

const AppSourceCopRules: ICodeAnalyzerRule[] = [
  {
    id: "AS0001",
    title:
      "Tables and table extensions that have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0002",
    title: "Fields must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0003",
    title: "The previous version of the extension could not be found.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0004",
    title: "Fields must not change type, since dependent extensions may break",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0005",
    title: "Fields must not change name",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0006",
    title: "Tables that have been published must not change name.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0009",
    title: "Key fields must not be changed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0010",
    title: "Keys must not be deleted, since dependent extensions may break",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0011",
    title: "An affix is required",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0013",
    title: "The field identifier must be within the allowed range",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0014",
    title: "The project manifest must contain the allocated identifier range",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0015",
    title: "TranslationFile must be enabled.",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0016",
    title:
      "Fields of field class 'Normal' must use the DataClassification property and its value should be different from ToBeClassified",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0018",
    title: "A procedure belonging to the public API cannot be removed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0019",
    title: "Event attributes cannot be removed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0020",
    title: "The type of events cannot be changed.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0021",
    title: "An argument in an event attribute cannot be changed to false.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0022",
    title: "An external scope cannot be removed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0023",
    title: "A return type cannot be modified in external procedures",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0024",
    title: "Parameters cannot be removed or added in external procedures",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0025",
    title: "Parameters cannot be modified, renamed, or removed from events.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0026",
    title:
      "The type and subtype of parameters cannot be modified in events and external procedures",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0027",
    title:
      "Modifying the array size of a parameter in events and external procedures is not allowed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0028",
    title:
      "Reducing the array size of a parameter in events and external procedures is not allowed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0029",
    title:
      "Pages and PageExtensions that have been published must not be deleted, since dependent extensions may break",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0030",
    title: "Pages that have been published must not be renamed.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0031",
    title: "Actions that have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0032",
    title: "Controls that have been published must not be deleted/",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0033",
    title: "Views that have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0034",
    title: "Unsupported table property change",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0036",
    title: "Unsupported table field property change",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0038",
    title: "Unsupported table key property change",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0039",
    title: "Removing properties that cause destructive changes is not allowed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0041",
    title:
      "Table field property changes that cause destructive changes must not be removed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0042",
    title:
      "Table key property changes that cause destructive changes must not be removed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0043",
    title: "Unique keys must not be deleted",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0044",
    title: "Property changes that cause destructive changes are not allowed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0047",
    title: "The extension name is too long.",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0048",
    title: "The publisher name is too long.",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0049",
    title:
      "The access modifier of an application object cannot be changed to a value that provides less access",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0050",
    title: "The extensibility of an application object cannot be removed",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0051",
    title: "Manifest property is required for AppSource submission",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0052",
    title: "The property 'url' must be set to a valid URL",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0053",
    title:
      "The compilation target of an application must be a value that is allowed in a multi-tenant SaaS environment",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0054",
    title:
      "The AppSourceCop configuration must specify the set of affixes used by the application",
    category: "Configuration",
    defaultSeverity: "Error",
  },
  {
    id: "AS0055",
    title:
      "The AppSourceCop configuration must specify the list of countries targeted by the application",
    category: "Configuration",
    defaultSeverity: "Hidden",
  },
  {
    id: "AS0056",
    title:
      "The country codes specified in the 'supportedCountries' property must be valid ISO 3166-1 alpha-2 codes",
    category: "Configuration",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0057",
    title:
      "Translations must be provided for all the locales in which the application will be available",
    category: "Extensibility",
    defaultSeverity: "Hidden",
  },
  {
    id: "AS0058",
    title: "Only use AssertError in Test Codeunits",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0059",
    title:
      "Reserved database tables are read-only in a multi-tenant environment",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0060",
    title: "Unsafe methods cannot be invoked in an AppSource application",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0061",
    title: "Procedures must not subscribe to CompanyOpen events",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0062",
    title: "Page controls and actions must use the ApplicationArea property",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0063",
    title: "Removing a var modifier in events is not allowed",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0064",
    title:
      "Interface implementations that have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0065",
    title: "Interfaces that have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0066",
    title:
      "A new method to an interface that has been published must not be added.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0067",
    title:
      "Adding an interface to an enum that has been published must have a default implementation.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0068",
    title: "Changing a table extension's target is not allowed.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0069",
    title:
      "An enum field replacing an option field should have at least the same number of members.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0070",
    title:
      "An enum field replacing an option field should preserve the member names.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0071",
    title:
      "An enum field replacing an option field should preserve the member ordinal values.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0072",
    title:
      "The ObsoleteTag property and the Tag in the Obsolete attribute must be set to the next release version.",
    category: "Design",
    defaultSeverity: "Hidden",
  },
  {
    id: "AS0073",
    title: "Obsolete Tag must be set.",
    category: "Design",
    defaultSeverity: "Hidden",
  },
  {
    id: "AS0074",
    title: "The Obsolete Tag must be the same across branches.",
    category: "Design",
    defaultSeverity: "Hidden",
  },
  {
    id: "AS0075",
    title: "Obsolete Reason must be set.",
    category: "Design",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0076",
    title: "Obsolete Tag format.",
    category: "Design",
    defaultSeverity: "Hidden",
  },
  {
    id: "AS0077",
    title: "Adding a var modifier in events is not allowed",
    category: "Upgrade",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0078",
    title:
      "Adding or removing a var modifier in external procedures is not allowed",
    category: "Upgrade",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0079",
    title: "An affix is required for procedures defined in extension objects.",
    category: "Extensibility",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0080",
    title: "Fields must not decrease in length",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0081",
    title: "InternalsVisibleTo should not be used as a security feature.",
    category: "Extensibility",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0082",
    title: "It is not allowed to rename an enum value.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0083",
    title: "It is not allowed to delete a value from an enum.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0084",
    title:
      "The ID range assigned to the extension must be within the allowed range",
    category: "Extensibility",
    defaultSeverity: "Error",
  },
  {
    id: "AS0085",
    title:
      "The 'application' property must be used instead of explicit dependencies",
    category: "Extensibility",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0086",
    title: "Fields must not increase in length",
    category: "Upgrade",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0087",
    title: "Translations of enum value captions must not contain commas",
    category: "Extensibility",
    defaultSeverity: "Warning",
  },
  {
    id: "AS0088",
    title:
      "Objects with an ID that can be referenced and which have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0089",
    title:
      "Objects that can be referenced and which have been published must not be deleted.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0090",
    title:
      "Objects that can be referenced and which have been published must not be renamed.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0091",
    title:
      "One or more dependencies of the previous version of the extension could not be found.",
    category: "Upgrade",
    defaultSeverity: "Error",
  },
  {
    id: "AS0092",
    title:
      "The 'applicationInsightsKey' property must specify the AAD instrumentation key.",
    category: "Configuration",
    defaultSeverity: "Warning",
  },
];

export default AppSourceCopRules;
