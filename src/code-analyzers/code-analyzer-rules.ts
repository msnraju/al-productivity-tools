import AppSourceCopRules from "./app-source-cop-rules";
import CodeCopRules from "./code-cop-rules";
import ICodeAnalyzerRule from "./models/code-analyzer-rule.model";
import PerTenantExtensionCopRules from "./per-tenant-extension-cop-rules";
import UICopRules from "./ui-cop-rules";

const CodeAnalyzerRules: ICodeAnalyzerRule[] = [
  ...CodeCopRules,
  ...AppSourceCopRules,
  ...UICopRules,
  ...PerTenantExtensionCopRules,
];

export default CodeAnalyzerRules;
