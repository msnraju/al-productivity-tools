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
  setDefaultDataClassification: boolean;
}
