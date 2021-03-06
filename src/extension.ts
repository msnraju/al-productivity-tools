import * as vscode from "vscode";
import VariableCodeActionProvider from "./code-actions/variable-code-action-provider";
import ALCodeCopFixer from "./commands/al-codecop";
import ALDiagnostics from "./commands/al-diagnostics";
import ALFileCommands from "./commands/al-file-commands";
import WorkspaceEvents from "./commands/workspace-events";
import { Tooltips } from "./tooltips/Tooltips";


export function activate(context: vscode.ExtensionContext) {
  try {
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
        "alProductivityTools.exportDiagnostics",
        ALDiagnostics.exportDiagnostics
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "alProductivityTools.exportMissingTooltips",
        Tooltips.exportMissingTooltips
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "alProductivityTools.importMissingTooltips",
        Tooltips.importMissingTooltips
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "alProductivityTools.fixALFileNamingNotation",
        ALFileCommands.fixALFileNamingNotation
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "alProductivityTools.fixALCurrentFileNamingNotation",
        ALFileCommands.fixALCurrentFileNamingNotation
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        "alProductivityTools.insertGuid",
        ALFileCommands.insertGuid
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

    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument(
        WorkspaceEvents.onDidSaveTextDocument
      )
    );
    
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument(
        WorkspaceEvents.onDidOpenTextDocument
      )
    );
  } catch (err) {
    console.log(err);
  }
}

export function deactivate() {}
