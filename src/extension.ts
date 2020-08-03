import * as vscode from "vscode";
import VariableCodeActionProvider from "./code-actions/variable-code-action-provider";
import ALCodeCopFixer from "./commands/al-codecop-fixer";
import ALFileNameFixer from "./commands/al-file-name-fixer";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.fixALCodeCopIssues",
      ALCodeCopFixer.fixALCodeCopIssues
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.fixALCodeCopIssuesInAllFiles",
      ALCodeCopFixer.fixALCodeCopIssuesInWorkspace
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.fixALFileNamingNotation",
      ALFileNameFixer.fixALFileNamingNotation
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.fixALCurrentFileNamingNotation",
      ALFileNameFixer.fixALCurrentFileNamingNotation
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      "al",
      new VariableCodeActionProvider(),
      {
        providedCodeActionKinds:
          VariableCodeActionProvider.providedCodeActionKinds,
      }
    )
  );
}

export function deactivate() {}
