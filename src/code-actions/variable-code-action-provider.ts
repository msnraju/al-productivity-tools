import * as vscode from "vscode";
import IVariableDeclaration from "./variables/variable-declaration";
import VariableNameService from "./variables/variable-name-service";
import ActiveVariableReader from "./variables/active-variable-reader";

export default class VariableCodeActionProvider
  implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): Promise<vscode.CodeAction[] | undefined> {
    return new Promise(async resolve => {
      const variable = ActiveVariableReader.getVariable(document, range);
      if (!variable) {
        resolve;
      }
  
      const names = VariableNameService.getNameSuggestions(variable!);
      if (!names || names.length === 0) {
        resolve;
      }
  
      const fixes:vscode.CodeAction[] = [];
  
      for (let i = 0; i < names.length; i++) {
        if (names[i] === variable!.name) {
          continue;
        }
  
        fixes.push(await this.createFix(document, range, names[i], variable!));
      }

      resolve(fixes);
    });
  }

  private async createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    name: string,
    variable: IVariableDeclaration
  ): Promise<vscode.CodeAction> {
    return new Promise(async resolve => {
      const title = `Change variable name to: ${name}`;
      const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
  
      const line = document.lineAt(range.start.line);
      const pos = line.text.indexOf(variable.matchText);
      const start = new vscode.Position(range.start.line, pos);
  
      fix.edit = await vscode.commands.executeCommand('vscode.executeDocumentRenameProvider',
        document.uri,
        start,
        name);
  
      resolve(fix);
    });
  }
}
