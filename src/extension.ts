import * as vscode from "vscode";
import { ALFormatter } from "./al-readers/al-formatter";
import { ObjectReader } from "./al-readers/object-reader";
import FixALFileName from "./fix-al-file-name";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "AL Productivity Tools" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.standardizeALCode",
      () => {
        try {
          const editor = vscode.window.activeTextEditor;

          if (editor) {
            const document = editor.document;

            // Get the word within the selection
            const content = document.getText();
            const lines = content.split("\n");
            const s = new vscode.Position(0, 0);
            const e = new vscode.Position(
              lines.length,
              lines[lines.length - 1].length
            );
            const range = new vscode.Range(s, e);

            const newContent = ObjectReader.convert(content);
            editor.edit((editBuilder) => {
              editBuilder.replace(range, newContent);
            });
          }
        } catch (err) {
          vscode.window.showErrorMessage(
            "An error occurred while reading this AL file!"
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.standardizeALFiles",
      () => {
        try {
          if (vscode.workspace.workspaceFolders)
            ALFormatter.readALFiles(
              vscode.workspace.workspaceFolders[0].uri.fsPath
            );
        } catch (err) {
          vscode.window.showInformationMessage(
            "An error occurred while standardizing AL files in this workspace!"
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "alProductivityTools.fixAlFileNames",
      async () => {
        try {
          if (vscode.workspace.workspaceFolders)
            await FixALFileName.fixFileNames(
              vscode.workspace.workspaceFolders[0].uri.fsPath
            );

          vscode.window.showInformationMessage(
            "AL file names corrected as per the best practices"
          );
        } catch (err) {
          vscode.window.showInformationMessage(
            "An error occurred while standardizing AL files in this workspace!"
          );
        }
      }
    )
  );
}

export function deactivate() {}
