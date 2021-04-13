import * as vscode from "vscode";
import IVariableDeclaration from "./variables/variable-declaration";
import VariableNameService from "./variables/variable-name-service";
import ActiveVariableReader from "./variables/active-variable-reader";

export default class VariableCodeActionProvider
  implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const variable = ActiveVariableReader.getVariable(document, range);
    if (!variable) {
      return;
    }

    const names = VariableNameService.getNameSuggestions(variable);
    if (!names || names.length === 0) {
      return;
    }

    const fixes = [];

    for (let i = 0; i < names.length; i++) {
      if (names[i] === variable.name) {
        continue;
      }

      const fix = this.createFix(document, range, names[i], variable);
      if (i === 0) {
        fix.isPreferred = true;
      }
      
      fixes.push(fix);
    }

    return fixes;
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    name: string,
    variable: IVariableDeclaration
  ): vscode.CodeAction {
    const title = `Change variable name to: ${name}`;
    const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
    fix.edit = new vscode.WorkspaceEdit();

    const line = document.lineAt(range.start.line);
    const pos = line.text.indexOf(variable.matchText);
    const start = new vscode.Position(range.start.line, pos);

    fix.edit.replace(
      document.uri,
      new vscode.Range(start, start.translate(0, variable.name.length)),
      `${name}`
    );
    return fix;
  }
}
