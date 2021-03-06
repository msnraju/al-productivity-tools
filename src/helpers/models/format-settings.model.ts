import KeyValueMap from "../../al-objects/maps/key-value-map";
import { AppSymbols } from "../../symbol-references";

export default interface IFormatSetting {
  renameFileNameOnSave: boolean;
  wrapProcedure: boolean;
  sortVariables: boolean;
  sortProcedures: boolean;
  convertKeywordsToAL: boolean;
  appendParenthesisAfterProcedures: boolean;
  removeUnusedLocalProcedures: boolean;
  removeUnusedLocalVariables: boolean;
  removeUnusedGlobalVariables: boolean;
  removeUnusedParameters: boolean;
  autoCorrectVariableNames: boolean;
  setDefaultApplicationArea: boolean;
  setDefaultDataClassification: boolean;
  qualifyWithRecPrefix: boolean;
  extensionFunctions: KeyValueMap;

  symbols: AppSymbols[];
}
