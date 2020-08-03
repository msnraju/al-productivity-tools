import * as vscode from "vscode";
import IVariableDeclaration from "./variable-declaration";

export default class ActiveVariableReader {
  static getVariable(
    document: vscode.TextDocument,
    range: vscode.Range
  ): IVariableDeclaration | undefined {
    const start = range.start;
    const line = document.lineAt(start.line);
    const text = line.text.trim();
    const expression = /((\w*)\s*:)\s*(\w*)\s+(".*"|\w*)\s*(temporary)?\s*;?.*/i;

    if (!expression.test(text)) return;
    const match = expression.exec(text);
    if (!match) return;

    let objectName = match[4] || "";
    if (objectName.startsWith('"'))
      objectName = objectName.substr(1, objectName.length - 2);

    return {
      matchText: match[1],
      name: match[2],
      objectName: objectName,
      dataType: match[3],
      temporary: (match[5] || "").toLowerCase() === "temporary",
    };
  }
}
