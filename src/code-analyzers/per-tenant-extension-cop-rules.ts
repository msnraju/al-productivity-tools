import ICodeAnalyzerRule from "./models/code-analyzer-rule.model";

const PerTenantExtensionCopRules: ICodeAnalyzerRule[] = [
  {
    id: "PTE0001",
    title: "Object ID must be in free range.",
    category: "ObjectValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0002",
    title: "Field ID must be in free range.",
    category: "ObjectValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0003",
    title: "Functions must not subscribe to CompanyOpen events.",
    category: "ObjectValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0004",
    title: "Table definitions must have a matching permission set.",
    category: "ObjectValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0005",
    title: "Property 'target' has invalid value.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0006",
    title: "Encryption key functions must not be invoked.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0007",
    title: "Test assertion functions are not allowed in a non-test context.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0008",
    title: "Fields must use ApplicationArea property.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0009",
    title: "This app.json property must not be used for per-tenant extensions.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0010",
    title: "The extension name length must not exceed the specified limit.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0011",
    title:
      "The extension publisher length must not exceed the specified limit.",
    category: "PackageValidation",
    defaultSeverity: "Error",
  },
  {
    id: "PTE0012",
    title: "InternalsVisibleTo should not be used as a security feature.",
    category: "Extensibility",
    defaultSeverity: "Warning",
  },
];

export default PerTenantExtensionCopRules;
